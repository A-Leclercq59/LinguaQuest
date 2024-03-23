import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { challengeId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.challenge.findFirst({
    where: {
      id: params.challengeId,
    },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { challengeId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.challenge.update({
    where: {
      id: params.challengeId,
    },
    data: {
      ...body,
    },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.challenge.delete({
    where: {
      id: params.challengeId,
    },
  });

  return NextResponse.json(data);
};
