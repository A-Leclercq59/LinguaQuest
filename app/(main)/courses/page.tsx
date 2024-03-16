import { getCourses } from "@/prisma/queries";

import { List } from "./_components/List";

const CoursesPage = async () => {
  const courses = await getCourses();

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">Language Courses</h1>
      <List
        courses={courses}
        activeCourseId="c4f3ba28-1fe4-4d47-a5f2-19f09d7e32cb"
      />
    </div>
  );
};

export default CoursesPage;
