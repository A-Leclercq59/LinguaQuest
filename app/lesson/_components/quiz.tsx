"use client";

import { Challenge, ChallengeOption } from "@prisma/client";
import { useState } from "react";

import { Header } from "./header";

type Props = {
  initialLessonId: string;
  initialHearts: number;
  initialPercentage: number;
  initialLessonChallenges: (Challenge & {
    completed: boolean;
    challengeOptions: ChallengeOption[];
  })[];
  userSubscription: any;
};

export const Quiz = ({
  initialLessonId,
  initialLessonChallenges,
  initialHearts,
  initialPercentage,
  userSubscription,
}: Props) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
    </>
  );
};
