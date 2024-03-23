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

    await db.course.createMany({
      data: [
        {
          id: "1",
          title: "Spanish",
          imageSrc: "/es.svg",
        },
        {
          id: "2",
          title: "Italian",
          imageSrc: "/it.svg",
        },
        {
          id: "3",
          title: "French",
          imageSrc: "/fr.svg",
        },
        {
          id: "4",
          title: "Croatian",
          imageSrc: "/hr.svg",
        },
      ],
    });

    await db.unit.createMany({
      data: [
        {
          id: "1",
          courseId: "1", // Spanish
          title: "Unit 1",
          description: "Learn the basics of Spanish",
          order: 1,
        },
      ],
    });

    await db.lesson.createMany({
      data: [
        {
          id: "1",
          unitId: "1", // "Learn the basics...",
          title: "Nouns",
          order: 1,
        },
        {
          id: "2",
          unitId: "1", // "Learn the basics...",
          title: "Verbs",
          order: 2,
        },
        {
          id: "3",
          unitId: "1", // "Learn the basics...",
          title: "Verbs",
          order: 3,
        },
        {
          id: "4",
          unitId: "1", // "Learn the basics...",
          title: "Verbs",
          order: 4,
        },
        {
          id: "5",
          unitId: "1", // "Learn the basics...",
          title: "Verbs",
          order: 5,
        },
      ],
    });

    await db.challenge.createMany({
      data: [
        {
          id: "1",
          lessonId: "1", // Nouns
          type: "SELECT",
          order: 1,
          question: 'Which one of the is "the man"?',
        },
        {
          id: "2",
          lessonId: "1", // Nouns
          type: "ASSIST",
          order: 2,
          question: '"the man"',
        },
        {
          id: "3",
          lessonId: "1", // Nouns
          type: "SELECT",
          order: 3,
          question: 'Wich one of the is "the robot"?',
        },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        {
          id: "1",
          challengeId: "1", // Wich one of the is "the man"?
          imageSrc: "/man.svg",
          correct: true,
          text: "el hombre",
          audioSrc: "/es_man.mp3",
        },
        {
          id: "2",
          challengeId: "1", // Wich one of the is "the man"?
          imageSrc: "/woman.svg",
          correct: false,
          text: "la mujer",
          audioSrc: "/es_woman.mp3",
        },
        {
          id: "3",
          challengeId: "1", // Wich one of the is "the man"?
          imageSrc: "/robot.svg",
          correct: false,
          text: "el robot",
          audioSrc: "/es_robot.mp3",
        },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        {
          id: "4",
          challengeId: "2", // "the man"
          correct: true,
          text: "el hombre",
          audioSrc: "/es_man.mp3",
        },
        {
          id: "5",
          challengeId: "2", // "the man"
          correct: false,
          text: "la mujer",
          audioSrc: "/es_woman.mp3",
        },
        {
          id: "6",
          challengeId: "2", // "the man"
          correct: false,
          text: "el robot",
          audioSrc: "/es_robot.mp3",
        },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        {
          id: "7",
          challengeId: "3", // Wich one of the is "the robot"?
          imageSrc: "/man.svg",
          correct: false,
          text: "el hombre",
          audioSrc: "/es_man.mp3",
        },
        {
          id: "8",
          challengeId: "3", // Wich one of the is "the robot"?
          imageSrc: "/woman.svg",
          correct: false,
          text: "la mujer",
          audioSrc: "/es_woman.mp3",
        },
        {
          id: "9",
          challengeId: "3", // Wich one of the is "the robot"?
          imageSrc: "/robot.svg",
          correct: true,
          text: "el robot",
          audioSrc: "/es_robot.mp3",
        },
      ],
    });

    await db.challenge.createMany({
      data: [
        {
          id: "4",
          lessonId: "2", // Verbs
          type: "SELECT",
          order: 1,
          question: 'Wich one of the is "the man"?',
        },
        {
          id: "5",
          lessonId: "2", // Verbs
          type: "ASSIST",
          order: 2,
          question: '"the man"',
        },
        {
          id: "6",
          lessonId: "2", // Verbs
          type: "SELECT",
          order: 3,
          question: 'Wich one of the is "the robot"?',
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
