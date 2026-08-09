import type { Blog, Author, Category, User, Tag } from "@prisma/client";

export type BlogStatus = string;

export type BlogWithRelations = Blog & {
  author: Author & { user: Pick<User, "name" | "email"> };
  category: Category;
  tags: { tag: Tag }[];
};

export type BlogCardData = {
  id: number;
  title: string;
  slug: string;
  description: string;
  featuredImage: string | null;
  readingTime: number;
  publishedAt: Date | null;
  status: BlogStatus;
  category: { name: string; slug: string };
  author: { name: string; avatarUrl?: string | null; slug?: string };
};

export type DashboardStats = {
  totalBlogs: number;
  published: number;
  pending: number;
  rejected: number;
  drafts: number;
  users: number;
  authors: number;
  categories: number;
};

export type SortOption = "latest" | "oldest" | "popular";
