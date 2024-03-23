import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.challengeOption.findFirst({
    where: {
      id: params.challengeOptionId,
    },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.challengeOption.update({
    where: {
      id: params.challengeOptionId,
    },
    data: {
      ...body,
    },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.challengeOption.delete({
    where: {
      id: params.challengeOptionId,
    },
  });

  return NextResponse.json(data);
};
