import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, type, expectedType } = body;

    if (typeof id !== "number" || !["trail", "journal"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (type === "trail") {
      const trail = await prisma.trailLocation.findUnique({
        where: { id },
        include: { _count: { select: { journalPosts: true } } },
      });

      if (!trail) {
        return NextResponse.json({ error: "Trail not found" }, { status: 404 });
      }

      if (trail._count.journalPosts > 0) {
        return NextResponse.json(
          {
            error: `Cannot delete trail with ${trail._count.journalPosts} related journal post(s). Remove the relationships first.`,
          },
          { status: 400 }
        );
      }

      await prisma.trailLocation.delete({ where: { id } });
    } else if (type === "journal") {
      const post = await prisma.journalPost.findUnique({ where: { id } });

      if (!post) {
        return NextResponse.json(
          { error: "Journal post not found" },
          { status: 404 }
        );
      }

      if (expectedType && post.type !== expectedType) {
        return NextResponse.json(
          { error: "Journal post not found" },
          { status: 404 }
        );
      }

      await prisma.journalPost.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api:admin:delete]", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
