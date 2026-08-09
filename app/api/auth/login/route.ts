import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.role.name !== "ADMIN" && user.role.name !== "AUTHOR") {
    return NextResponse.json({ error: "Invalid account role." }, { status: 500 });
  }

  await setSessionCookie({
    userId: user.id,
    role: user.role.name,
    name: user.name,
    email: user.email,
  });

  return NextResponse.json({ ok: true, role: user.role.name });
}
