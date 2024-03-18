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
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }

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

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.unit.findMany({
    orderBy: {
      order: "asc",
    },
    where: {
      courseId: userProgress.activeCourseId,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
        include: {
          unit: true,
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

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgresses ||
          challenge.challengeProgresses.length === 0 ||
          challenge.challengeProgresses.some(
            (progress) => progress.completed === false
          )
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: string) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.lesson.findFirst({
    where: {
      id: lessonId,
    },
    include: {
      challenges: {
        orderBy: {
          order: "asc",
        },
        include: {
          challengeOptions: true,
          challengeProgresses: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgresses &&
      challenge.challengeProgresses.length > 0 &&
      challenge.challengeProgresses.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  return percentage;
});
