import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AuthorSidebar from "@/components/AuthorSidebar";
import AuthorBlogTable from "@/components/AuthorBlogTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Approved" };

export default async function ApprovedPage() {
  const session = await getSession();
  const author = await prisma.author.findUnique({ where: { userId: session!.userId } });
  const blogs = await prisma.blog.findMany({
    where: { authorId: author!.id, status: "PUBLISHED" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs/approved" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Approved &amp; published</h1>
        <AuthorBlogTable
          blogs={blogs}
          emptyTitle="Nothing published yet"
          emptyDescription="Once an admin approves a submission, it appears here and goes live on the site."
        />
      </div>
    </div>
  );
}
