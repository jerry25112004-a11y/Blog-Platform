import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AuthorSidebar from "@/components/AuthorSidebar";
import AuthorBlogTable from "@/components/AuthorBlogTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Blogs" };

export default async function MyBlogsPage() {
  const session = await getSession();
  const author = await prisma.author.findUnique({ where: { userId: session!.userId } });
  const blogs = await prisma.blog.findMany({
    where: { authorId: author!.id },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">My blogs</h1>
        <AuthorBlogTable
          blogs={blogs}
          emptyTitle="No blogs yet"
          emptyDescription="Everything you write — drafts, submissions, and published work — lives here."
          showEdit
        />
      </div>
    </div>
  );
}
