import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validation/schemas";
import { db } from "@/lib/db/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form input", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // Check existing user
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = await createSessionToken({ userId: user.id, email: user.email });
    await setSessionCookie(token);

    return NextResponse.json({ user, message: "Account created successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to register account" },
      { status: 500 }
    );
  }
}
