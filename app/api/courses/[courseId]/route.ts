import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.course.findFirst({
    where: {
      id: params.courseId,
    },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.course.update({
    where: {
      id: params.courseId,
    },
    data: {
      ...body,
    },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.course.delete({
    where: {
      id: params.courseId,
    },
  });

  return NextResponse.json(data);
};
