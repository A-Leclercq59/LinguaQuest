"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";
import { Course } from "@prisma/client";
import { Card } from "./Card";

type Props = {
  courses: Course[];
  activeCourseId?: string;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const { execute, status } = useAction(upsertUserProgress, {
    onError() {
      toast.error("Someting went wrong");
    },
  });

  const onClick = (courseId: string) => {
    if (status === "executing") return;

    if (courseId === activeCourseId) {
      return router.push("/learn");
    }

    execute({ courseId });
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
          disabled={status === "executing"}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
