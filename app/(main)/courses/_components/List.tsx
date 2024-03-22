"use client";

import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";
import { Card } from "./Card";

type Props = {
  courses: Course[];
  activeCourseId?: string;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (courseId: string) => {
    if (pending) return;

    if (courseId === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgress(courseId).catch(() =>
        toast.error("Something went wrong.")
      );
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
