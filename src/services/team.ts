import prisma from "@/libs/prisma";
import { Team } from "@/prisma/generated";
import { Result } from "@/types/result";
import {
  AddTeamUsersPayload,
  CreateTeamPayload,
  DeleteTeamUsersPayload,
  UpdateTeamUsersPayload,
} from "@/validations/team";

export async function getTeams(): Promise<Result<Team[]>> {
  const teams = await prisma.team.findMany({
    include: {
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              nip: true,
              email: true,
            },
          },
          isAdmin: true,
        },
      },
    },
  });

  return {
    data: teams,
    message: "successfully retrieved teams",
    code: 200,
  };
}

export async function getTeam(teamId: string): Promise<Result<Team>> {
  const team = await prisma.team.findFirst({
    include: {
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              nip: true,
              email: true,
            },
          },
          isAdmin: true,
        },
      },
    },
    where: {
      id: teamId,
    },
  });

  if (!team) {
    return {
      data: null,
      message: "team not found",
      code: 404,
    };
  }

  return {
    data: team,
    message: "successfully retrieved team details",
    code: 200,
  };
}

export async function createTeam(
  payload: CreateTeamPayload
): Promise<Result<Team>> {
  const team = await prisma.team.create({
    data: {
      name: payload.name,
    },
  });

  return {
    data: team,
    message: "successfully created team",
    code: 201,
  };
}

export async function addTeamUsers(
  teamId: string,
  payload: AddTeamUsersPayload
): Promise<Result<Team>> {
  await prisma.usersOnTeams.createMany({
    data: payload.map((user) => ({
      teamId: teamId,
      userId: user.userId,
      isAdmin: user.isAdmin,
    })),
  });

  return {
    data: null,
    message: "successfully added team users",
    code: 200,
  };
}

export async function deletedTeamUsers(
  teamId: string,
  payload: DeleteTeamUsersPayload
): Promise<Result<Team>> {
  await prisma.usersOnTeams.deleteMany({
    where: {
      teamId: teamId,
      userId: {
        in: payload.map((user) => user.userId),
      },
    },
  });

  return {
    data: null,
    message: "successfully deleted team users",
    code: 204,
  };
}

export async function updatedTeamUsers(
  teamId: string,
  userId: string,
  payload: UpdateTeamUsersPayload
): Promise<Result<Team>> {
  await prisma.usersOnTeams.update({
    where: {
      teamId_userId: {
        teamId: teamId,
        userId: userId,
      },
    },
    data: {
      isAdmin: payload.isAdmin,
    },
  });

  return {
    data: null,
    message: "successfully updated team users",
    code: 200,
  };
}
