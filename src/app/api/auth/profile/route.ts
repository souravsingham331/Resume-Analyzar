import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword, clearSessionCookie } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, newPassword } = body;

    const updateData: { name?: string; passwordHash?: string } = {};
    if (name && typeof name === "string") updateData.name = name;
    if (newPassword && typeof newPassword === "string" && newPassword.length >= 8) {
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, email: true, name: true, updatedAt: true },
    });

    return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cascade delete user data
    await db.user.delete({ where: { id: user.id } });
    await clearSessionCookie();

    return NextResponse.json({ message: "Account and all associated data deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete account" }, { status: 500 });
  }
}
