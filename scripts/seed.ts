import { db } from "@/lib/db";

const main = async () => {
  try {
    await db.course.deleteMany();
    await db.userProgress.deleteMany();

    await db.course.createMany({
      data: [
        {
          title: "Spanish",
          imageSrc: "/es.svg",
        },
        {
          title: "Italian",
          imageSrc: "/it.svg",
        },
        {
          title: "French",
          imageSrc: "/fr.svg",
        },
        {
          title: "Croatian",
          imageSrc: "/hr.svg",
        },
      ],
    });

    console.log("Seeding finished");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to seed the database");
  }
};

main();
