import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export const GET = async () => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.challengeOption.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.challengeOption.create({
    data: {
      ...body,
    },
  });

  return NextResponse.json(data);
};
