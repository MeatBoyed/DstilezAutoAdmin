"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { VehicleCard, VehicleCardSkeleton } from "@/components/VehicleEditCard";
import { Vehicle } from "@prisma/client";
import { InferRequestType } from "hono";
import { honoClient } from "../api/[[...route]]/route";

export default function Vehicles({ className }: { className?: string }) {
  const $get = honoClient.vehicle.$get;
  const fetcher = (arg: InferRequestType<typeof $get>) => async () =>
    await $get(arg).then(async (res) => await res.json());

  const { data, error, isLoading } = useSWR<Vehicle[]>(
    "get-vehicles",
    fetcher({})
  );

  const vehicles = useMemo(
    () =>
      data && data.length > 0 ? (
        data.map((vehicle, index) => (
          <VehicleCard vehicle={vehicle} key={index} />
        ))
      ) : (
        <p>You have no vehicles. Let&#39;s go add one!</p>
      ),
    [data]
  );

  console.log("Vehicles: ", data);

  return (
    <div
      className={cn(
        "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full",
        className
      )}
    >
      {isLoading && (
        <>
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
        </>
      )}
      {error && !isLoading && <p>Error: {error}</p>}
      {data && !isLoading && !error && vehicles}
    </div>
  );
}
