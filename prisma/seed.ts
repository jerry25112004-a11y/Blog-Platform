import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import readingTime from "reading-time";

const prisma = new PrismaClient();

function toSlug(s: string) {
  return slugify(s, { lower: true, strict: true, trim: true });
}

function calcReadingTime(content: string) {
  const stripped = content.replace(/<[^>]+>/g, " ");
  return Math.max(1, Math.ceil(readingTime(stripped).minutes));
}

const CATEGORY_SEED = [
  { name: "Engineering", description: "Software architecture, backend systems, and developer tools." },
  { name: "Design", description: "Product design, UX research, and visual craft." },
  { name: "Product", description: "Building products people actually want to use." },
  { name: "Career", description: "Growth, mentorship, and navigating tech careers." },
  { name: "Startups", description: "Founding stories, fundraising, and early-stage lessons." },
  { name: "AI & Machine Learning", description: "Applied ML, LLMs, and the tools built around them." },
  { name: "Databases", description: "Data modeling, SQL, and storage engines." },
  { name: "Culture", description: "Remote work, team dynamics, and engineering culture." },
];

const AUTHOR_SEED = [
  { name: "Sara Malik", email: "sara.malik@inkwell.dev", bio: "Backend engineer writing about distributed systems and SQL Server internals." },
  { name: "Daniyal Ahmed", email: "daniyal.ahmed@inkwell.dev", bio: "Product designer obsessed with typography and design systems." },
  { name: "Emily Chen", email: "emily.chen@inkwell.dev", bio: "Full-stack developer and open-source maintainer." },
  { name: "Hassan Raza", email: "hassan.raza@inkwell.dev", bio: "Engineering manager writing about career growth and team culture." },
  { name: "Fatima Sheikh", email: "fatima.sheikh@inkwell.dev", bio: "ML engineer exploring practical uses of language models." },
  { name: "James Okafor", email: "james.okafor@inkwell.dev", bio: "Startup founder sharing lessons from building in public." },
];

const TITLE_TEMPLATES = [
  "A practical guide to {topic}",
  "What I learned building {topic}",
  "{topic}: a deep dive",
  "Rethinking {topic} in 2026",
  "The case for {topic}",
  "Lessons from scaling {topic}",
  "How we approach {topic} on our team",
  "{topic} explained for beginners",
];

const TOPICS = [
  "database indexing", "server-side rendering", "design tokens", "API rate limiting",
  "code review culture", "onboarding new engineers", "SQL query optimization", "component libraries",
  "remote pair programming", "feature flags", "technical debt", "user research",
  "prompt engineering", "vector search", "authentication systems", "caching strategies",
  "accessibility audits", "microservices", "product roadmaps", "async communication",
  "type-safe APIs", "design critique", "incident response", "growth experiments",
  "developer onboarding docs", "database migrations", "state management", "startup hiring",
  "technical writing", "monorepo tooling", "CI/CD pipelines", "dark mode design",
  "customer interviews", "engineering rituals", "load testing", "data pipelines",
  "founder burnout", "open source maintenance", "career transitions", "mentorship programs",
  "editorial workflows", "content strategy", "site reliability", "GraphQL vs REST",
  "SQL Server performance tuning", "React server components", "design system governance",
  "technical interviews", "cross-functional collaboration", "changelog writing",
];

const CATEGORY_IMAGE_THEMES: Record<string, { background: string; foreground: string }> = {
  Engineering: { background: "1f4d3a", foreground: "f4f1e8" },
  Design: { background: "b85c42", foreground: "fff8f0" },
  Product: { background: "315c78", foreground: "f4f1e8" },
  Career: { background: "8a6a2f", foreground: "fff8f0" },
  Startups: { background: "7a3e52", foreground: "fff8f0" },
  "AI & Machine Learning": { background: "3d536b", foreground: "f4f1e8" },
  Databases: { background: "245b63", foreground: "f4f1e8" },
  Culture: { background: "684b3c", foreground: "fff8f0" },
};

function buildPlaceholderImage(categoryName: string, title: string) {
  const theme = CATEGORY_IMAGE_THEMES[categoryName] ?? { background: "263238", foreground: "ffffff" };
  const text = encodeURIComponent(title);
  return `https://placehold.co/1200x800/${theme.background}/${theme.foreground}?text=${text}`;
}

function paragraph(topic: string) {
  return `<p>When we first started thinking seriously about ${topic}, most of the advice we found online was either too abstract to act on or too specific to someone else's stack to be useful. This piece is an attempt to close that gap — grounded in decisions we actually made, the trade-offs we weighed, and what we'd do differently with what we know now.</p>`;
}

function buildContent(topic: string) {
  return [
    paragraph(topic),
    `<h2>Why ${topic} matters more than it looks</h2>`,
    `<p>It's easy to treat ${topic} as a solved problem, but the details matter enormously once you're operating at any real scale. Small inconsistencies compound, and the cost of getting it wrong is rarely visible until much later.</p>`,
    `<h2>What we changed</h2>`,
    `<ul><li>Started with the smallest version that could prove the idea</li><li>Measured before optimizing, not after</li><li>Wrote down the reasoning, not just the decision</li></ul>`,
    `<h2>Where we landed</h2>`,
    `<p>None of this is a silver bullet. But treating ${topic} as a first-class concern — instead of an afterthought — changed how confidently the team could ship. If you're weighing similar trade-offs, start smaller than feels comfortable and instrument everything.</p>`,
  ].join("\n");
}

async function main() {
  console.log("Seeding roles…");
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });
  const authorRole = await prisma.role.upsert({
    where: { name: "AUTHOR" },
    update: {},
    create: { name: "AUTHOR" },
  });

  console.log("Seeding blog statuses lookup…");
  const statuses: { code: any; label: string }[] = [
    { code: "DRAFT", label: "Draft" },
    { code: "PENDING", label: "Pending Review" },
    { code: "APPROVED", label: "Approved" },
    { code: "REJECTED", label: "Rejected" },
    { code: "PUBLISHED", label: "Published" },
    { code: "UNPUBLISHED", label: "Unpublished" },
  ];
  for (const s of statuses) {
    await prisma.blogStatusLookup.upsert({ where: { code: s.code }, update: {}, create: s });
  }

  console.log("Seeding admin user…");
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@inkwell.dev" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@inkwell.dev",
      passwordHash: adminPasswordHash,
      roleId: adminRole.id,
    },
  });

  console.log("Seeding categories…");
  const categories = [];
  for (const c of CATEGORY_SEED) {
    const category = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, slug: toSlug(c.name), description: c.description },
    });
    categories.push(category);
  }

  console.log("Seeding authors…");
  const authorPasswordHash = await bcrypt.hash("Author@12345", 12);
  const authors = [];
  for (const a of AUTHOR_SEED) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        name: a.name,
        email: a.email,
        passwordHash: authorPasswordHash,
        roleId: authorRole.id,
        author: { create: { bio: a.bio } },
      },
      include: { author: true },
    });
    const author = user.author ?? (await prisma.author.findUnique({ where: { userId: user.id } }));
    if (author) authors.push(author);
  }

  console.log("Seeding 50 blogs…");
  const existingCount = await prisma.blog.count();
  if (existingCount >= 50) {
    console.log(`Already have ${existingCount} blogs — skipping blog seed.`);
  } else {
    for (let i = 0; i < 50; i++) {
      const topic = TOPICS[i % TOPICS.length];
      const template = TITLE_TEMPLATES[i % TITLE_TEMPLATES.length];
      const title = `${template.replace("{topic}", topic)}`.replace(/^./, (c) => c.toUpperCase());
      const author = authors[i % authors.length];
      const category = categories[i % categories.length];
      const content = buildContent(topic);

      // Distribute statuses: mostly published, some pending/draft/rejected for a realistic workflow demo.
      const roll = i % 10;
      const status = roll < 7 ? "PUBLISHED" : roll < 8 ? "PENDING" : roll < 9 ? "DRAFT" : "REJECTED";

      const daysAgo = 50 - i;
      const publishedAt = new Date(Date.now() - daysAgo * 86400000);

      let slug = toSlug(title);
      const found = await prisma.blog.findUnique({ where: { slug } });
      if (found) slug = `${slug}-${i}`;

      await prisma.blog.create({
        data: {
          title,
          slug,
          description: `A closer look at ${topic} — what worked, what didn't, and what we'd change next time.`,
          content,
          featuredImage: buildPlaceholderImage(category.name, title),
          references: i % 4 === 0 ? "https://martinfowler.com\nhttps://sqlperformance.com" : null,
          readingTime: calcReadingTime(content),
          status: status as any,
          authorId: author!.id,
          categoryId: category.id,
          viewCount: Math.floor(Math.random() * 500),
          submittedAt: status !== "DRAFT" ? publishedAt : null,
          reviewedAt: status === "PUBLISHED" || status === "REJECTED" ? publishedAt : null,
          publishedAt: status === "PUBLISHED" ? publishedAt : null,
          rejectReason: status === "REJECTED" ? "Needs more concrete examples and a clearer intro before this is ready to publish." : null,
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Admin login: admin@inkwell.dev / Admin@12345");
  console.log("Author login (any seeded author): e.g. sara.malik@inkwell.dev / Author@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
