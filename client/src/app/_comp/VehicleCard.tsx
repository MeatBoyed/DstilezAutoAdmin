import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Car, Eye, EyeOff, Fuel, Gauge } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { cn } from "@/lib/utils";
import { Vehicle } from "@prisma/client";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import { s3Converter } from "@/server/util/BusinessLayer";

export function VehicleCard({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const VehiclePath = `/vehicle/${vehicle.stockId}`;
  return (
    <Card className="border-0  md:min-w-fit min-w-max bg-transparent">
      <div className={cn("relative w-full overflow-hidden rounded-xl  hover:cursor-pointer", className)}>
        <Link href={VehiclePath} className="w-full h-full">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={vehicle.images[0]} // Assuming you have an array of images
              alt={`${vehicle.title} Thumbnail`}
              fill
              quality={35}
              loader={s3Converter}
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </Link>
        <div className="absolute flex justify-center items-center gap-3 top-0 right-0 pr-2 pt-2 ">
          {vehicle.title === "107" ? (
            <EyeOff size={25} className="rounded-md bg-blue-500 px-1  text-white" />
          ) : (
            <Eye size={25} className="rounded-md bg-blue-500 px-1  text-white" />
          )}
        </div>
      </div>
      <CardContent className="px-1 flex flex-col gap-3 pt-4">
        <div className="flex gap-3 justify-start items-center flex-wrap">
          <div className="flex justify-center items-center gap-1">
            <Calendar size={18} />
            <p className="leading-7 text-sm">{vehicle.year}</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <Gauge size={18} />
            <p className="leading-7 text-sm">{vehicle.milage.toLocaleString()}</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <Car size={18} />
            <p className="leading-7 text-sm">{vehicle.transmission}</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <Fuel size={18} />
            <p className="leading-7 text-sm">{vehicle.fuelType}</p>
          </div>
        </div>

        <Link href={VehiclePath} className="w-full h-full">
          <p className="line-clamp-1 text-sm font-medium leading-none">{vehicle.title}</p>
        </Link>
        <p className="text-lg font-semibold">R {vehicle.price.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
