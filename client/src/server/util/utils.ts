import { UploadedImages } from "@/components/UploadShad/server/honoS3Types";
import { VehicleFormSchema } from "@/lib/Formlibs";
import { Vehicle } from "@prisma/client";
import { z } from "zod";

export function createVehicleObject(vehicle: z.infer<typeof VehicleFormSchema>, images: UploadedImages[]): Vehicle {
  return {
    //   Meta
    stockId: vehicle.stockId,
    title: vehicle.title,
    price: vehicle.price,

    //   Core
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant,
    milage: vehicle.milage,
    year: vehicle.year,

    //   Detials
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    condition: vehicle.condition,
    bodyType: vehicle.bodyType,
    color: vehicle.color,

    //   Others
    newUsed: vehicle.newUsed,
    mmCode: vehicle.mmCode,

    images: images.map((image) => image.url),
    extras: vehicle.extras.map((extra) => extra.text),
  };
}
