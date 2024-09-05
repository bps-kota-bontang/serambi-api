import { DATABASE_URL, NODE_ENV } from "@/configs/constant";
import { PrismaClient, User } from "@/prisma/generated";

const consoleIterator = console[Symbol.asyncIterator]();

console.log("Environment:", NODE_ENV);
console.log("Connecting to Database:", DATABASE_URL);

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});

const populateUser = async () => {
  const users: (Omit<User, "id" | "createdAt" | "updatedAt"> & {
    id: string | null;
  })[] = [
    {
      id: "cm0pvtbuo00000clc36eg50n6",
      name: "user",
      nip: "111111111111111111",
      email: "user@mail.com",
      password: "123456",
      isSuper: true,
    },
  ];

  for (const user of users) {
    const { id, password, ...restUser } = user;
    await prisma.user.upsert({
      where: { id: id ?? "" },
      update: {
        ...restUser,
        password: await Bun.password.hash(password),
      },
      create: {
        ...restUser,
        password: await Bun.password.hash(password),
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
  if (NODE_ENV !== "development") {
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
    console.log("Disconnecting from Database:", DATABASE_URL);
    await prisma.$disconnect();
    process.exit(1);
  });
