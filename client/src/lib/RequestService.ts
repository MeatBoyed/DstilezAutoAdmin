"use server";
import { auth } from "@clerk/nextjs/server";
import { env } from "../../env";
import { Vehicle } from "@prisma/client";
import { searchParams } from "@/app/(Core)/page";
import { VehiclePaginationResponse } from "@/server/util/BusinessLogic";

export async function getData(stockId?: string) {
  const { getToken } = auth();

  const res = await fetch(`${env.NEXT_PUBLIC_HOST_URL}/api/vehicles/${stockId}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (!res.ok) {
    console.log("Vehicle Controller Error", res);
    return undefined;
  }

  return (await res.json()) as Vehicle;
}

export async function searchVehicles(searchParams: searchParams) {
  const { getToken } = auth();

  const res = await fetch(
    `${env.NEXT_PUBLIC_HOST_URL}/api/vehicles/?page=${searchParams.page || 1}&order=${searchParams.order}&fueltype=${
      searchParams.fueltype
    }&make=${searchParams.make}&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${
      searchParams.color
    }`,
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  if (!res.ok) {
    console.log("Vehicle Controller Search Error", res);
    return undefined;
  }

  return (await res.json()) as VehiclePaginationResponse;
}
