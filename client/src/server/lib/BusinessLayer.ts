import S3Service from "@/components/Upload-Shad/main/server/S3Service";
import db from "../util/database";
import { z } from "zod";
import { VehicleFormSchema, VehicleSchemaType } from "@/lib/Formlibs";
import { createVehicle, createVehicleObject } from "../util/utils";
import { Vehicle } from "@prisma/client";

class BusinessLayer {
  private S3Service: S3Service;

  constructor() {
    this.S3Service = new S3Service();
  }

  async CreateVehicle(vehiclePayload: VehicleSchemaType): Promise<{ success?: Vehicle; failure?: true; message?: string }> {
    //   Check vehicle doesn't exist
    const existResponse = await this.handleCheckVehicleExists(vehiclePayload.stockId);
    if (existResponse) return { failure: true, message: "Vehicle already exists" };

    return await db.vehicle
      .create({
        data: { ...vehiclePayload, extras: vehiclePayload.extras.map((extra) => extra.text) },
      })
      .then((vehicle) => {
        return { success: vehicle };
      })
      .catch((error) => {
        // console.log("BusinessLayer: Unable to create vehicle", error);
        return { failure: true, message: "Unable to create vehicle" };
      });
  }

  async DeleteVehicle(stockid: number) {
    // Get the Images from the vehicle
    const vehicle = await db.vehicle.findUnique({
      where: { stockId: stockid },
      select: { images: true },
    });

    if (!vehicle) return { failure: true, message: "Vehicle not found" };

    // Delete Images from AWS
    await this.S3Service.deleteFiles(vehicle.images).catch((error) => {
      console.log("BusinessLayer: Unable to delete files", error);
      return { failure: true, message: "Unable to delete files" };
    });

    await db.vehicle
      .update({
        where: { stockId: stockid },
        data: { title: "107" }, // Setting 107 as delete keyword
      })
      .catch((error) => {
        console.log("BusinessLayer: Unable to delete vehicle", error);
        return { failure: true, message: "Unable to delete vehicle" };
      });

    return { success: true, message: "Vehicle deleted" };
  }

  /**
   * Checks if Vehcile (stockId) exists in the DB
   * @param stockId Vehicle to search for
   * @returns 0 if Vehicle is not found
   */
  async handleCheckVehicleExists(stockId: number) {
    return await db.vehicle
      .findUnique({
        where: {
          stockId: stockId,
        },
        select: { stockId: true },
      })
      .then((res) => (res ? res.stockId : undefined));
  }
}

export default BusinessLayer;
