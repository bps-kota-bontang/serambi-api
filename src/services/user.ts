import prisma from "@/libs/prisma";
import { User } from "@/prisma/generated";
import { Result } from "@/types/result";

export async function getUsers(): Promise<
  Result<Omit<User, "password" | "createdAt" | "updatedAt">[]>
> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      nip: true,
      email: true,
      isSuper: true,
      teams: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          isAdmin: true,
        },
      },
    },
  });

  return {
    data: users,
    message: "successfully retrieved users",
    code: 200,
  };
}

export async function getUser(
  userId: string
): Promise<Result<Omit<User, "password" | "createdAt" | "updatedAt">>> {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      nip: true,
      email: true,
      isSuper: true,
      teams: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          isAdmin: true,
        },
      },
    },
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      data: null,
      message: "user not found",
      code: 404,
    };
  }

  return {
    data: user,
    message: "successfully retrieved user details",
    code: 200,
  };
}
