import prisma from "@/libs/prisma";
import { User } from "@/prisma/generated";
import { JWT } from "@/types/jwt";
import { Result } from "@/types/result";
import { UpdateUserPasswordPayload } from "@/validations/user";

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

export async function updateUserPassword(
  userId: string,
  payload: UpdateUserPasswordPayload,
  claims: JWT
): Promise<Result<any>> {
  const { newPassword, confirmNewPassword, oldPassword } = payload;

  const user = await prisma.user.findFirst({
    select: {
      id: true,
      password: true,
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

  if (user.id !== claims.sub) {
    return {
      data: null,
      message: "user does not have access to this service",
      code: 401,
    };
  }

  if (newPassword !== confirmNewPassword) {
    return {
      data: null,
      message: "password does not match",
      code: 400,
    };
  }

  const isMatch = await Bun.password.verify(oldPassword, user.password);

  if (!isMatch) {
    return {
      data: null,
      message: "Invalid credential",
      code: 400,
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await Bun.password.hash(newPassword),
    },
  });

  return {
    data: null,
    message: "successfully updated user password",
    code: 200,
  };
}
