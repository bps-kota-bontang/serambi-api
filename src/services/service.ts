import prisma from "@/libs/prisma";
import { Service } from "@/prisma/generated";
import { JWT } from "@/types/jwt";
import { Result } from "@/types/result";
import {
  AddServiceTeamsPayload,
  CreateServicePayload,
  DeleteServiceTeamsPayload,
  GetServicePayload,
} from "@/validations/service";

export async function getServices(
  payload: GetServicePayload,
  claims: JWT
): Promise<Result<{ services: Service[]; total: number }>> {
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

  const teamIds = user.teams.map((team) => team.teamId);

  const page = parseInt(payload.page || "1") || 1;
  const limit = parseInt(payload.limit || "15") || 15;
  const offset = (page - 1) * limit;
  const tags = payload.tags ? payload.tags.split(",") : undefined;
  const keyword = payload.keyword;

  const total = await prisma.service.count({
    where: {
      teams: {
        some: {
          teamId: {
            in: teamIds,
          },
        },
      },
      ...(tags && { tags: { hasSome: tags } }),
      ...(keyword && {
        OR: [
          {
            name: { contains: keyword, mode: "insensitive" },
          },
          {
            description: { contains: keyword, mode: "insensitive" },
          },
        ],
      }),
    },
  });

  const services = await prisma.service.findMany({
    where: {
      teams: {
        some: {
          teamId: {
            in: teamIds,
          },
        },
      },
      ...(tags && { tags: { hasSome: tags } }),
      ...(keyword && {
        OR: [
          {
            name: { contains: keyword, mode: "insensitive" },
          },
          {
            description: { contains: keyword, mode: "insensitive" },
          },
        ],
      }),
    },
    include: {
      teams: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });

  return {
    data: { services, total },
    message: "successfully retrieved services",
    code: 200,
  };
}

export async function getServiceTags(
  claims: JWT
): Promise<Result<Pick<Service, "tags">>> {
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

  const teamIds = user.teams.map((team) => team.teamId);

  const serviceTags = await prisma.service.findMany({
    distinct: ["tags"],
    select: {
      tags: true,
    },
    where: {
      teams: {
        some: {
          teamId: {
            in: teamIds,
          },
        },
      },
    },
  });

  const mergedTags = Array.from(
    new Set(serviceTags.flatMap((tag: any) => tag.tags))
  ) as string[];

  const result = { tags: mergedTags };

  return {
    data: result,
    message: "successfully retrieved service tags",
    code: 200,
  };
}

export async function getService(
  serviceId: string,
  claims: JWT
): Promise<Result<Service>> {
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

  const teamIds = user.teams.map((team) => team.teamId);

  const service = await prisma.service.findFirst({
    include: {
      teams: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    return {
      data: null,
      message: "service not found",
      code: 404,
    };
  }

  const hasAccess = service.teams.some((item) =>
    teamIds.includes(item.team.id)
  );

  if (!hasAccess) {
    return {
      data: null,
      message: "user does not have access to this service",
      code: 403,
    };
  }

  return {
    data: service,
    message: "successfully retrieved service details",
    code: 200,
  };
}

export async function createService(
  payload: CreateServicePayload
): Promise<Result<Service>> {
  const service = await prisma.service.create({
    data: {
      name: payload.name,
      description: payload.description,
      imageUrl: payload.imageUrl,
      link: payload.link,
      tags: payload.tags,
    },
  });

  return {
    data: service,
    message: "successfully created service",
    code: 201,
  };
}

export async function addServiceTeams(
  serviceId: string,
  payload: AddServiceTeamsPayload,
  claims: JWT
): Promise<Result<Service>> {
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

  const teamIds = user.teams.map((item) => item.teamId);

  const hasAccess = payload.every((item) => teamIds.includes(item.teamId));

  if (!hasAccess) {
    return {
      data: null,
      message: "user does not have access to this service",
      code: 403,
    };
  }

  await prisma.sevicesOnTeams.createMany({
    data: payload.map((team) => ({
      serviceId: serviceId,
      teamId: team.teamId,
    })),
  });

  return {
    data: null,
    message: "successfully added service teams",
    code: 201,
  };
}

export async function deletedServiceTeams(
  serviceId: string,
  payload: DeleteServiceTeamsPayload,
  claims: JWT
): Promise<Result<Service>> {
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

  const teamIds = user.teams.map((item) => item.teamId);

  const hasAccess = payload.every((item) => teamIds.includes(item.teamId));

  if (!hasAccess) {
    return {
      data: null,
      message: "user does not have access to this service",
      code: 403,
    };
  }

  await prisma.sevicesOnTeams.deleteMany({
    where: {
      serviceId: serviceId,
      teamId: {
        in: payload.map((team) => team.teamId),
      },
    },
  });

  return {
    data: null,
    message: "successfully deleted service teams",
    code: 204,
  };
}
