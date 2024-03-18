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

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.unit.findMany({
    where: {
      courseId: userProgress.activeCourseId,
    },
    include: {
      lessons: {
        include: {
          challenges: {
            include: {
              challengeProgresses: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgresses &&
          challenge.challengeProgresses.length > 0 &&
          challenge.challengeProgresses.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});
