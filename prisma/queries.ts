import { cache } from "react";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getCourses = cache(async () => {
  const courses = await db.course.findMany();

  return courses;
});

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.userProgress.findFirst({
    where: {
      userId,
    },
    include: {
      activeCourse: true,
    },
  });

  return data;
});

export const getCourseById = cache(async (courseId: string) => {
  const data = await db.course.findFirst({
    where: {
      id: courseId,
    },
    // TODO: Populate units and lessons
  });

  return data;
});
