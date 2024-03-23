import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { lessonId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.lesson.findFirst({
    where: {
      id: params.lessonId,
    },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { lessonId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.lesson.update({
    where: {
      id: params.lessonId,
    },
    data: {
      ...body,
    },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { lessonId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.lesson.delete({
    where: {
      id: params.lessonId,
    },
  });

  return NextResponse.json(data);
};
