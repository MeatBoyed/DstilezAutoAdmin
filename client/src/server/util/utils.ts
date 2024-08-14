import { Vehicle } from "@prisma/client";
import { VehicleSchemaType } from "@/lib/Formlibs";

export function createVehicle(vehicle: VehicleSchemaType): Vehicle {
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

    images: vehicle.images,
    extras: vehicle.extras.map((extra) => extra.text),
  };
}
