import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/users" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Users</h1>

        <div className="glass-card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs uppercase tracking-wide text-ink2">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-4 font-medium text-ink">{u.name}</td>
                  <td className="p-4 text-ink2">{u.email}</td>
                  <td className="p-4 text-ink2">{u.role.name}</td>
                  <td className="p-4 text-ink2">{formatDate(u.createdAt)}</td>
                  <td className="p-4">
                    <span className={`status-pill ${u.isActive ? "bg-forest/10 text-forest-dark" : "bg-clay/10 text-clay"}`}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
