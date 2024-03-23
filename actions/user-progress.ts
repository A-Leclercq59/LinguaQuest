"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { POINTS_TO_REFILL } from "@/constant";
import { db } from "@/lib/db";
import {
  getCourseById,
  getUserProgress,
  getUserSubscription,
} from "@/prisma/queries";

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

  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error("Course is empty");
  }

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
  const userSubscription = await getUserSubscription();

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

  if (userSubscription?.isActive) {
    return { error: "subscription" };
  }

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

export const refillHeart = async () => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error("User Progress not found");
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error("Hearts are already full");
  }

  if (currentUserProgress.points < POINTS_TO_REFILL) {
    throw new Error("Not enough points");
  }

  await db.userProgress.update({
    where: {
      userId: currentUserProgress.userId,
    },
    data: {
      hearts: 5,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
