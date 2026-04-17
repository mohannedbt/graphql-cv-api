import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db"
});

export const prisma = new PrismaClient({ adapter });


async function main() {
  // Create users
  await prisma.user.createMany({
    data: [
      { id: 'user1', name: 'Mohanned', email: 'mohanned@mail.com', role: 'USER' },
      { id: 'user2', name: 'Bob', email: 'bob@mail.com', role: 'ADMIN' },
      { id: 'user3', name: 'Charlie', email: 'charlie@mail.com', role: 'USER' }
    ],
    // skipDuplicates: true
  });

  // Create skills
  await prisma.skill.createMany({
    data: [
      { id: 's1', name: 'JavaScript' },
      { id: 's2', name: 'Design' },
      { id: 's3', name: 'Data Analysis' }
    ],
    // skipDuplicates: true
  });
}

main()
  .then(() => {
    console.log('Seeding complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });