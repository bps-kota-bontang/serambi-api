import prisma from "@/libs/prisma";
import { Service } from "@/prisma/generated";
import { Result } from "@/types/result";
import { CreateServicePayload } from "@/validations/service";

export async function getServices(): Promise<Result<Service[]>> {
  const services = await prisma.service.findMany({
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
  });

  return {
    data: services,
    message: "successfully retrieved services",
    code: 200,
  };
}

export async function getService(serviceId: string): Promise<Result<Service>> {
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
