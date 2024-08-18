import prisma from "@/libs/prisma";
import { Team } from "@/prisma/generated";
import { Result } from "@/types/result";
import { CreateTeamPayload } from "@/validations/team";

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
