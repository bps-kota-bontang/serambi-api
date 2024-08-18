import { PrismaClient, User } from "@/prisma/generated";

const url = Bun.env.DATABASE_URL;
const nodeEnv = Bun.env.NODE_ENV;

const consoleIterator = console[Symbol.asyncIterator]();

console.log("Environment:", nodeEnv);
console.log("Connecting to Database:", url);

const prisma = new PrismaClient({
  datasourceUrl: url,
});

const populateUser = async () => {
  const users: Omit<User, "createdAt" | "updatedAt">[] = [
    {
      id: "clzzpk9hy00000cmn1n7k8q3w",
      name: "user",
      nip: "111111111111111111",
      email: "user@mail.com",
      password: "123456",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        ...user,
        password: await Bun.password.hash(user.password),
      },
      create: {
        ...user,
        password: await Bun.password.hash(user.password),
      },
    });
  }

  console.log("Users have been populated.");
};

const seeding = async () => {
  console.log("\nRunning seeding...\n");

  await populateUser();

  console.log("\nSeeding completed.\n");
};

const main = async () => {
  if (nodeEnv !== "development") {
    console.log(
      "\nYou are not in a development environment. Are you sure you want to continue? (yes/No)"
    );

    const answer = (await consoleIterator.next()).value;

    if (answer.toLowerCase() !== "yes") {
      console.log("\nSeeding aborted.\n");
      return;
    }
  }
  await seeding();
};

main()
  .then(() => {})
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    console.log("Disconnecting from Database:", url);
    await prisma.$disconnect();
    process.exit(1);
  });
