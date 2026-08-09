import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const authorRole = await prisma.role.upsert({
    where: { name: "AUTHOR" },
    update: {},
    create: { name: "AUTHOR" },
  });

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      roleId: authorRole.id,
      author: { create: {} },
    },
  });

  await setSessionCookie({ userId: user.id, role: "AUTHOR", name: user.name, email: user.email });

  return NextResponse.json({ ok: true });
}
