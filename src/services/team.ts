import prisma from "@/libs/prisma";
import { Team } from "@/prisma/generated";
import { JWT } from "@/types/jwt";
import { Result } from "@/types/result";
import { isAdminTeam } from "@/utils/team";
import {
  AddTeamUsersPayload,
  CreateTeamPayload,
  DeleteTeamUsersPayload,
  UpdateTeamUserPayload,
  UpdateTeamUsersPayload,
} from "@/validations/team";

export async function getTeams(claims?: JWT): Promise<Result<Team[]>> {
  let teamIds: string[] = [];
  if (claims) {
    const user = await prisma.user.findFirst({
      select: {
        teams: {
          select: {
            teamId: true,
          },
        },
      },
      where: { id: claims.sub },
    });

    if (!user) {
      return {
        data: null,
        message: "user not found",
        code: 404,
      };
    }

    teamIds = user.teams.map((team) => team.teamId);
  }

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
    where: {
      ...(teamIds.length > 0 && {
        id: {
          in: teamIds,
        },
      }),
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
  payload: CreateTeamPayload,
  claims: JWT
): Promise<Result<Team>> {
  if (!claims.isSuper) {
    return {
      data: null,
      message: "user does not have access to create team",
      code: 403,
    };
  }

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
  payload: AddTeamUsersPayload,
  claims: JWT
): Promise<Result<Team>> {
  const team = await prisma.team.findFirst({
    select: {
      users: {
        select: {
          userId: true,
          isAdmin: true,
        },
      },
    },
    where: {
      id: teamId,
    },
  });

  const isAdmin = isAdminTeam(claims, team);

  if (!isAdmin) {
    return {
      data: null,
      message: "user does not have access to add team users",
      code: 403,
    };
  }

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
    code: 201,
  };
}

export async function deletedTeamUsers(
  teamId: string,
  payload: DeleteTeamUsersPayload,
  claims: JWT
): Promise<Result<Team>> {
  const team = await prisma.team.findFirst({
    select: {
      users: {
        select: {
          userId: true,
          isAdmin: true,
        },
      },
    },
    where: {
      id: teamId,
    },
  });

  const isAdmin = isAdminTeam(claims, team);

  if (!isAdmin) {
    return {
      data: null,
      message: "user does not have access to delete team users",
      code: 403,
    };
  }

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

export async function updatedTeamUser(
  teamId: string,
  userId: string,
  payload: UpdateTeamUserPayload,
  claims: JWT
): Promise<Result<Team>> {
  if (!claims.isSuper) {
    return {
      data: null,
      message: "user does not have access to update team users",
      code: 403,
    };
  }

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

export async function updatedTeamUsers(
  teamId: string,
  payload: UpdateTeamUsersPayload,
  claims: JWT
): Promise<Result<Team>> {
  const team = await prisma.team.findFirst({
    select: {
      users: {
        select: {
          userId: true,
          isAdmin: true,
        },
      },
    },
    where: {
      id: teamId,
    },
  });

  const isAdmin = isAdminTeam(claims, team);

  if (!isAdmin) {
    return {
      data: null,
      message: "user does not have access to this service",
      code: 403,
    };
  }

  await prisma.usersOnTeams.deleteMany({
    where: {
      teamId: teamId,
    },
  });

  const data = payload.map((user) => ({
    teamId: teamId,
    userId: user.userId,
  }));

  console.log(data);

  await prisma.usersOnTeams.createMany({
    data,
  });

  return {
    data: null,
    message: "successfully updated service users",
    code: 200,
  };
}

export async function deleteTeam(
  teamId: string,
  claims: JWT
): Promise<Result<null>> {
  const user = await prisma.user.findFirst({
    select: {
      isSuper: true,
    },
    where: { id: claims.sub },
  });

  if (!user) {
    return {
      data: null,
      message: "user not found",
      code: 404,
    };
  }

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },
    select: {
      id: true,
      users: {
        select: {
          userId: true,
          isAdmin: true,
        },
      },
    },
  });

  if (!team) {
    return {
      data: null,
      message: "team not found",
      code: 404,
    };
  }

  const hasAccess =
    team.users.some((item) => item.userId === claims.sub && item.isAdmin) ||
    user.isSuper;

  if (!hasAccess) {
    return {
      data: null,
      message: "user does not have access to this team",
      code: 403,
    };
  }

  await prisma.team.delete({
    where: {
      id: teamId,
    },
  });

  return {
    data: null,
    message: "successfully deleted team",
    code: 204,
  };
}
