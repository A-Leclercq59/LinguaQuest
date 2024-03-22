"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCourseById, getUserProgress } from "@/prisma/queries";

export const upsertUserProgress = async (courseId: string) => {
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
};

export const reduceHearts = async (challengeId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  // TODO: get user sub

  if (!currentUserProgress) {
    throw new Error("User Progress not found");
  }

  const challenge = await db.challenge.findFirst({
    where: {
      id: challengeId,
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.challengeProgress.findFirst({
    where: {
      userId,
      challengeId,
    },
  });

  const isPractice = !!existingChallengeProgress;

  if (isPractice) {
    return { error: "practice" };
  }

  // TODO: handle sub

  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  await db.userProgress.update({
    where: {
      userId,
    },
    data: {
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    },
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};
