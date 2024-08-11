import { Lead, Prisma, Vehicle } from "@prisma/client";
import db from "./database";
import { tuple, z } from "zod";

export type ModelNames = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

// Define a type for Prisma operations specific to a given model
type PrismaOperations<ModelName extends ModelNames> = Prisma.TypeMap["model"][ModelName]["operations"];

// Define a type for Prisma findMany arguments specific to a given model
type PrismaFindManyArgs<ModelName extends ModelNames> = PrismaOperations<ModelName>["findMany"]["args"];

export const OrderByEnum = z.enum([
  "title-asc",
  "title-desc",
  "price-asc",
  "price-desc",
  "milage-asc",
  "milage-desc",
  "year-asc",
  "year-desc",
]);

interface VehiclePaginationQuery {
  page: number; // Page number for pagination
  pageSize: number; // Page number for pagination
  where: PrismaFindManyArgs<"Vehicle">["where"]; // Filtering conditions for the query
  //   orderBy?: PrismaFindManyArgs<"Vehicle">["orderBy"];
  sortBy?: string;
  include?: PrismaFindManyArgs<"Vehicle">["include"];
}

interface LeadPaginationQuery {
  page: number; // Page number for pagination
  pageSize: number; // Page number for pagination
  where?: PrismaFindManyArgs<"Lead">["where"]; // Filtering conditions for the query
  sortBy?: string;
  select?: PrismaFindManyArgs<"Lead">["select"];
  include?: PrismaFindManyArgs<"Lead">["include"];
}

export interface VehiclePaginationResponse {
  items: Vehicle[];
  totalCount: number;
  totalPages: number;
}

export type LeadWithCustomerAndVehicle = Prisma.LeadGetPayload<{
  include: { Customer: true; Vehicle: true };
}>;

export interface LeadPaginationResponse {
  items: LeadWithCustomerAndVehicle[];
  totalCount: number;
  totalPages: number;
}

export async function VehiclePaginationRequest({
  page,
  pageSize,
  where,
  sortBy,
  include,
}: VehiclePaginationQuery): Promise<VehiclePaginationResponse> {
  console.log("Page Number: ", page);
  let orderBy: Prisma.VehicleOrderByWithRelationInput = { price: "desc" };

  try {
    const order = OrderByEnum.parse(sortBy);

    switch (order) {
      case "title-desc":
        orderBy = { title: "desc" };
        break;
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "milage-asc":
        orderBy = { milage: "asc" };
        break;
      case "milage-desc":
        orderBy = { milage: "desc" };
        break;
      case "year-asc":
        orderBy = { year: "asc" };
        break;
      case "year-desc":
        orderBy = { year: "desc" };
        break;
    }
  } catch {}

  const skip = (+page - 1) * +pageSize; // Calculate the number of items to skip based on the current page and page size

  const totalCount = await db.vehicle.count({ where }); // Get the total count of items satisfying the provided conditions

  const items = await db.vehicle.findMany({ where, orderBy, skip, take: pageSize });

  return {
    items,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function LeadPaginationRequest({
  page,
  pageSize,
  where,
  sortBy,
  // include,
  select,
}: LeadPaginationQuery): Promise<LeadPaginationResponse> {
  console.log("Page Number: ", page);
  // let orderBy: Prisma.VehicleOrderByWithRelationInput = { price: "desc" };

  const skip = (+page - 1) * +pageSize; // Calculate the number of items to skip based on the current page and page size

  const totalCount = await db.lead.count({ where }); // Get the total count of items satisfying the provided conditions

  const items = await db.lead.findMany({ where, skip, take: pageSize, include: { Customer: true, Vehicle: true } });

  const leads = await db.lead.findMany({ include: { Customer: true } });

  return {
    items,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
