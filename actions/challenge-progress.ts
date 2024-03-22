"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getUserProgress } from "@/prisma/queries";

export const upsertChallengeProgress = async (challengeId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  // TODO: handle subscription later

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
      challengeId,
      userId,
    },
  });

  const isPractice = !!existingChallengeProgress;

  // TODO: Not if user has a subscription
  if (currentUserProgress.hearts === 0 && !isPractice) {
    return { error: "hearts" };
  }

  if (isPractice) {
    await db.challengeProgress.update({
      where: {
        id: existingChallengeProgress.id,
      },
      data: {
        completed: true,
      },
    });

    await db.userProgress.update({
      where: {
        userId,
      },
      data: {
        hearts: Math.min(currentUserProgress.hearts + 1, 5),
        points: currentUserProgress.points + 10,
      },
    });

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }

  await db.challengeProgress.create({
    data: {
      challengeId,
      userId,
      completed: true,
    },
  });

  await db.userProgress.update({
    where: {
      userId,
    },
    data: {
      points: currentUserProgress.points + 10,
    },
  });

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};
