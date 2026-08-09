import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import AuthorCard from "@/components/AuthorCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authors" };

export default async function AdminAuthorsPage() {
  const authors = await prisma.author.findMany({
    include: { user: { select: { name: true } }, _count: { select: { blogs: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/authors" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Authors</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          {authors.map((a) => (
            <AuthorCard
              key={a.id}
              author={{ name: a.user.name, bio: a.bio, avatarUrl: a.avatarUrl, blogCount: a._count.blogs }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
