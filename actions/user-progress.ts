"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { action } from "@/lib/safe-action";
import { getCourseById, getUserProgress } from "@/prisma/queries";

const schema = z.object({
  courseId: z.string(),
});

export const upsertUserProgress = action(schema, async ({ courseId }) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  // TODO: Enabled once units and lessons are added
  /*if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error("Course is empty");
  }*/

  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await db.userProgress.update({
      where: {
        userId,
      },
      data: {
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
      },
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await db.userProgress.create({
    data: {
      userId,
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    },
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
});
