import { PrismaClient, Prisma } from '@/generated/prisma';
import { fakerFR } from '@faker-js/faker';

const prisma = new PrismaClient();

// Fonction utilitaire pour generer les utilisateurs
function generateUsers(role: 'STUDENT' | 'TEACHER', nb: number): Prisma.UserCreateInput[] {
  return Array.from({ length: nb }, () => {
    const sex = fakerFR.person.sex();
    const firstName = fakerFR.person.firstName(sex as 'male' | 'female');
    const lastName = fakerFR.person.lastName(sex as 'male' | 'female');

    return {
      name: `${firstName} ${lastName}`,
      email: fakerFR.internet.email({ firstName, lastName }),
      role: role,
    };
  });
}

async function resetDatabase() {
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}


export async function main() {
  console.log('Seed start...');
  console.log('Resetting database...');
  await resetDatabase();
  console.log('Database reset');

  const students = generateUsers('STUDENT', 20);
  const teachers = generateUsers('TEACHER', 3);

  await prisma.$transaction(async (tx) => {
    // Creation des étudiants
    console.log('Creating students...');
    const createdStudents = await Promise.all(
      students.map(student => tx.user.create({ data: student })),
    );
    console.table(createdStudents.map(s => ({ id: s.id, name: s.name, email: s.email, role: s.role })));

    // Création des enseignants
    console.log('Creating teachers...');
    const createdTeachers = await Promise.all(
      teachers.map(teacher => tx.user.create({ data: teacher })),
    );
    console.table(createdTeachers.map(t => ({ id: t.id, email: t.email, role: t.role })));

    console.log('Creating courses, lessons and enrollments...');
    for (const teacher of createdTeachers) {
      const numberOfCourse = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numberOfCourse; i++) {
        const course = await tx.course.create({
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

        /// Inscriptions aléatoires pour chaque cours
        const randomStudents = createdStudents
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 10) + 5); // 5 à 15 étudiants

        await Promise.all(
          randomStudents.map(student =>
            tx.enrollment.create({
              data: {
                studentId: student.id,
                courseId: course.id,
                progress: Math.floor(Math.random() * 100),
              },
            }),
          ));
        console.log(`Cours "${course.title}" créé avec ${randomStudents.length} étudiants inscrits`);
      }
    }
  });

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
