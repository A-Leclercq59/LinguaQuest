import { cache } from "react";

import { db } from "@/lib/db";

export const getCourses = cache(async () => {
  const courses = await db.courses.findMany();

  return courses;
});
