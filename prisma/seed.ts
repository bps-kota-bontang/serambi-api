import { DATABASE_URL, NODE_ENV } from "@/configs/constant";
import { PrismaClient, User } from "@/prisma/generated";
import { parse } from "papaparse";

const consoleIterator = console[Symbol.asyncIterator]();

console.log("Environment:", NODE_ENV);
console.log("Connecting to Database:", DATABASE_URL);

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});

const populateUser = async () => {
  const path = "prisma/data/users.csv";
  const file = Bun.file(path);
  const text = await file.text();

  const { data: users } = parse<Omit<User, "id" | "createdAt" | "updatedAt">>(
    text,
    {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    }
  );

  for (const user of users) {
    console.log("Populating user:", user.email);
    const { password, ...restUser } = user;
    await prisma.user.upsert({
      where: { email: user.email },
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
