import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, Calendar, Car, Gauge } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Vehicle } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

export function VehicleCard({
  vehicle,
  className,
}: {
  vehicle: Vehicle;
  className?: string;
}) {
  return (
    <Card className="border-0  md:min-w-fit min-w-max bg-transparent">
      <div
        className={cn(
          "relative h-32 sm:h-48 md:h-52 w-full overflow-hidden rounded-xl  hover:cursor-pointer",
          className
        )}
      >
        <Link
          href={`/vehicle-for-sale/${vehicle.title}`}
          className="w-full h-full"
        >
          <Image
            src={vehicle.images[0]} // Assuming you have an array of images
            alt={"yess"}
            width={320}
            height={300}
            // loader={Image}
            className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </Link>
      </div>
      <CardContent className="px-1 flex flex-col gap-3 pt-4">
        <div className="flex gap-3 justify-start items-center overflow-hidden">
          <div className="flex justify-center items-center gap-2">
            <Calendar size={20} />
            <p className="leading-7">{vehicle.year}</p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Gauge size={20} />
            <p className="leading-7">{vehicle.milage}</p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Car size={20} />
            <p className="leading-7">{vehicle.transmission}</p>
          </div>
        </div>

        <Link
          href={`/vehicle-for-sale/${vehicle.title}`}
          className="w-full h-full"
        >
          <p className="line-clamp-1 text-sm font-medium leading-none">
            {vehicle.title}
          </p>
        </Link>
        <p className="text-lg font-semibold">
          R {vehicle.price.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}

export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className="border-0  md:min-w-fit min-w-max bg-transparent">
      <div
        className={cn(
          "relative h-32 sm:h-48 md:h-52 w-full overflow-hidden rounded-xl  hover:cursor-pointer",
          className
        )}
      >
        {/* <Image
            src={vehicle.images[0]} // Assuming you have an array of images
            alt={"yess"}
            width={320}
            height={300}
            className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-110"
          /> */}
        <Skeleton className="w-full " />;
        <div className="absolute flex justify-center items-center gap-3 top-0 right-0 pr-2 pt-2 ">
          <p className="rounded-sm bg-[#1f93ff] px-2 py-1 text-xs font-semibold text-white">
            {/* {vehicle.saleType} */}
          </p>
        </div>
      </div>
      <CardContent className="px-1 flex flex-col gap-3 pt-4">
        <div className="flex gap-3 justify-start items-center overflow-hidden">
          <div className="flex justify-center items-center gap-2">
            <BedDouble size={20} />
            {/* <p className="leading-7">{vehicle.bedrooms}</p> */}
          </div>
          <div className="flex justify-center items-center gap-2">
            <Bath size={20} />
            {/* <p className="leading-7">{vehicle.bathrooms}</p> */}
          </div>
          {/* {vehicle.squareMeter && (
            <div className="flex justify-center items-center gap-2">
              <Ruler size={20} />
              <p className="leading-7">
                {vehicle.squareMeter.toLocaleString()} m&#178;
              </p>
            </div>
          )} */}
        </div>

        <p className="line-clamp-1 text-sm font-medium leading-none">
          {/* {vehicle.title} */}
        </p>
        <p className="text-lg font-semibold">
          {/* R {vehicle.price.toLocaleString()} */}
        </p>
      </CardContent>
    </Card>
  );
}
