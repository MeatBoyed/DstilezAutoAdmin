"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { cn, fetcher } from "@/lib/utils";
import { VehicleCard, VehicleCardSkeleton } from "@/components/VehicleEditCard";
import { Vehicle } from "@prisma/client";

export default function Vehicles({ className }: { className?: string }) {
  const { data, error, isLoading } = useSWR<Vehicle[]>("/api/vehicle", fetcher);

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
