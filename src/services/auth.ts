import prisma from "@/libs/prisma";
import { Result } from "@/types/result";
import { generateToken } from "@/utils/jwt";
import { getUserInfo } from "@/services/sso";

const login = async (email: string, password: string): Promise<Result<any>> => {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    return {
      data: null,
      message: "User not found",
      code: 404,
    };
  }

  const isMatch = await Bun.password.verify(password, user.password);

  if (!isMatch) {
    return {
      data: null,
      message: "Invalid credential",
      code: 400,
    };
  }

  const token = await generateToken(user);

  return {
    data: {
      token: token,
    },
    message: "Successfully logged in",
    code: 200,
  };
};

const loginSso = async (tokenSso: string): Promise<Result<any>> => {
  const userSso = await getUserInfo(tokenSso);

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: userSso.email,
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    if (!user) {
      return {
        data: null,
        message: "User not found",
        code: 404,
      };
    }
  }

  const token = await generateToken(user);

  return {
    data: {
      token: token,
    },
    message: "Successfully logged in",
    code: 200,
  };
};

export { login, loginSso };
