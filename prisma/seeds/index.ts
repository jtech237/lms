import { PrismaClient, Prisma } from '../../src/generated/prisma';
import { fakerFR } from '@faker-js/faker';

const prisma = new PrismaClient();

const students: Prisma.UserCreateInput[] = Array.from({ length: 20 }, () => {
  const sex = fakerFR.person.sex();
  const firstName = fakerFR.person.firstName(sex === 'male' ? 'male' : 'female');
  const lastName = fakerFR.person.lastName(sex === 'male' ? 'male' : 'female');

  return {
    name: `${firstName} ${lastName}`,
    email: fakerFR.internet.email({ firstName, lastName }),
    role: 'STUDENT',
  };
});

const teachers: Prisma.UserCreateInput[] = Array.from({ length: 3 }, () => {
  const sex = fakerFR.person.sex();
  const firstName = fakerFR.person.firstName(sex === 'male' ? 'male' : 'female');
  const lastName = fakerFR.person.lastName(sex === 'male' ? 'male' : 'female');

  return {
    name: `${firstName} ${lastName}`,
    email: fakerFR.internet.email({ firstName, lastName }),
    role: 'TEACHER',
  };
});


export async function main() {
  console.log('Seed start...');
  //Creation des etudiant
  const createdStudents = await Promise.all(
    students.map(student => prisma.user.create({ data: student })),
  );
  console.log(`${createdStudents.length} étudiants créés`);

  // Création des enseignants
  const createdTeachers = await Promise.all(
    teachers.map(teacher => prisma.user.create({ data: teacher })),
  );
  console.log(`${createdTeachers.length} enseignants créés`);

  // Création des cours pour chaque enseignant
  for (const teacher of createdTeachers) {
    const numberOfCourse = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numberOfCourse; i++) {
      const course = await prisma.course.create({
        data: {
          title: fakerFR.lorem.words({ min: 2, max: 4 }),
          description: fakerFR.lorem.paragraph(),
          coverImage: fakerFR.image.urlPicsumPhotos(),
          authorId: teacher.id,
          lessons: {
            create: Array.from({ length: Math.floor(Math.random() * 5 + 3) }, (_, index) => ({
              title: fakerFR.lorem.sentence(),
              content: fakerFR.lorem.paragraphs({ min: 3, max: 10 }),
              order: index + 1,
            })),
          },
        },
      });

      // Création des inscriptions aléatoires pour chaque cours
      const randomStudents = createdStudents
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 10) + 5); // 5 à 15 étudiants par cours

      await Promise.all(
        randomStudents.map(student =>
          prisma.enrollment.create({
            data: {
              studentId: student.id,
              courseId: course.id,
              progress: Math.random() * 100,
            },
          }),
        ));
      console.log(`Cours "${course.title}" créé avec ${randomStudents.length} étudiants inscrits`);

    }
  }
  console.log('Seeding terminé!');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
;
