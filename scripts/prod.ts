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
          title: "Spanish",
          imageSrc: "/es.svg",
        },
      ],
    });

    const courses = await db.course.findMany();

    for (const course of courses) {
      await db.unit.createMany({
        data: [
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ],
      });

      const units = await db.unit.findMany();

      for (const unit of units) {
        await db.lesson.createMany({
          data: [
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ],
        });
      }

      const lessons = await db.lesson.findMany();

      for (const lesson of lessons) {
        await db.challenge.createMany({
          data: [
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: 'Which one of these is "the man"?',
              order: 1,
            },
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: 'Which one of these is "the woman"?',
              order: 2,
            },
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: 'Which one of these is "the boy"?',
              order: 3,
            },
            {
              lessonId: lesson.id,
              type: "ASSIST",
              question: '"the man"',
              order: 4,
            },
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: 'Which one of these is "the zombie"?',
              order: 5,
            },
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: 'Which one of these is "the robot"?',
              order: 6,
            },
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: 'Which one of these is "the girl"?',
              order: 7,
            },
            {
              lessonId: lesson.id,
              type: "ASSIST",
              question: '"the zombie"',
              order: 8,
            },
          ],
        });
      }
      const challenges = await db.challenge.findMany();

      for (const challenge of challenges) {
        if (challenge.order === 1) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: true,
                text: "el hombre",
                imageSrc: "/man.svg",
                audioSrc: "/es_man.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "la mujer",
                imageSrc: "/woman.svg",
                audioSrc: "/es_woman.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el chico",
                imageSrc: "/boy.svg",
                audioSrc: "/es_boy.mp3",
              },
            ],
          });
        }

        if (challenge.order === 2) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: true,
                text: "la mujer",
                imageSrc: "/woman.svg",
                audioSrc: "/es_woman.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el chico",
                imageSrc: "/boy.svg",
                audioSrc: "/es_boy.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el hombre",
                imageSrc: "/man.svg",
                audioSrc: "/es_man.mp3",
              },
            ],
          });
        }

        if (challenge.order === 3) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: false,
                text: "la mujer",
                imageSrc: "/woman.svg",
                audioSrc: "/es_woman.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el hombre",
                imageSrc: "/man.svg",
                audioSrc: "/es_man.mp3",
              },
              {
                challengeId: challenge.id,
                correct: true,
                text: "el chico",
                imageSrc: "/boy.svg",
                audioSrc: "/es_boy.mp3",
              },
            ],
          });
        }

        if (challenge.order === 4) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
              },
              {
                challengeId: challenge.id,
                correct: true,
                text: "el hombre",
                audioSrc: "/es_man.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el chico",
                audioSrc: "/es_boy.mp3",
              },
            ],
          });
        }

        if (challenge.order === 5) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: false,
                text: "el hombre",
                imageSrc: "/man.svg",
                audioSrc: "/es_man.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "la mujer",
                imageSrc: "/woman.svg",
                audioSrc: "/es_woman.mp3",
              },
              {
                challengeId: challenge.id,
                correct: true,
                text: "el zombie",
                imageSrc: "/zombie.svg",
                audioSrc: "/es_zombie.mp3",
              },
            ],
          });
        }

        if (challenge.order === 6) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: true,
                text: "el robot",
                imageSrc: "/robot.svg",
                audioSrc: "/es_robot.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el zombie",
                imageSrc: "/zombie.svg",
                audioSrc: "/es_zombie.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el chico",
                imageSrc: "/boy.svg",
                audioSrc: "/es_boy.mp3",
              },
            ],
          });
        }

        if (challenge.order === 7) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: true,
                text: "la nina",
                imageSrc: "/girl.svg",
                audioSrc: "/es_girl.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el zombie",
                imageSrc: "/zombie.svg",
                audioSrc: "/es_zombie.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el hombre",
                imageSrc: "/man.svg",
                audioSrc: "/es_man.mp3",
              },
            ],
          });
        }

        if (challenge.order === 8) {
          await db.challengeOption.createMany({
            data: [
              {
                challengeId: challenge.id,
                correct: false,
                text: "la mujer",
                audioSrc: "/es_woman.mp3",
              },
              {
                challengeId: challenge.id,
                correct: true,
                text: "el zombie",
                audioSrc: "/es_zombie.mp3",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el chico",
                audioSrc: "/es_boy.mp3",
              },
            ],
          });
        }
      }
    }

    console.log("Seeding finished");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to seed the database");
  }
};

main();
