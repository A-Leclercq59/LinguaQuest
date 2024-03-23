import { db } from "@/lib/db";

const main = async () => {
  try {
    await db.course.deleteMany();
    await db.userProgress.deleteMany();
    await db.unit.deleteMany();
    await db.lesson.deleteMany();
    await db.challenge.deleteMany();
    await db.challengeOption.deleteMany();
    await db.challengeProgress.deleteMany();
    await db.userSubscription.deleteMany();

    console.log("Reset finished");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to seed the database");
  }
};

main();
