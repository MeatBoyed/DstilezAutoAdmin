import { Context, Hono } from "hono";
import db from "../util/database";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { ParseVehicleFormData } from "../util/FormDataConverters";
import { createVehicleObject } from "../util/utils";
import { PostImageError, PostImagesResponse, UploadedImages } from "@/components/UploadShad/server/honoS3Types";
import { DeleteImagesInS3, PostImagesToS3 } from "@/components/UploadShad/server/HonoS3";
import { getAuth } from "@hono/clerk-auth";
import { PaginationRequest } from "../util/BusinessLogic";

// TODO: Implement filtering of Delted Vehicles where applicable

const VEHICLES_PER_PAGE = 8;
const AWS_S3_BASE_URL = process.env.NEXT_PUBLIC_AWS_S3_BASE_URL;
if (AWS_S3_BASE_URL === undefined) {
  throw new Error("AWS_S3_BASE_URL is undefined");
}

export default new Hono()
  /**
   * Path ---> "/api/vehicles"
   * GET all vehicles
   */
  .get("/", async (c) => {
    const { page, pageSize, order, make, fueltype, transmission, bodytype, color } = c.req.query();

    await authenticateUser(c);

    return c.json(
      await PaginationRequest({
        page: typeof page === "string" ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : VEHICLES_PER_PAGE,
        where: {
          title: { not: "107" }, // Hide "Deleted Vehicles"
          make: { mode: "insensitive", equals: make != "undefined" ? make : undefined },
          fuelType: { mode: "insensitive", equals: fueltype != "undefined" ? fueltype : undefined },
          transmission: { mode: "insensitive", equals: transmission != "undefined" ? transmission : undefined },
          bodyType: { mode: "insensitive", equals: bodytype != "undefined" ? bodytype : undefined },
          color: { mode: "insensitive", equals: color != "undefined" ? color : undefined },
        },
        sortBy: order,
        // TODO implement WHere
      })
    );
  })
  /**
   * Path ---> "/api/vehicles"
   * Create vehicle (POST)
   */
  .post(
    "/",
    validator("form", (value, c) => {
      const parsed = ParseVehicleFormData(value);
      if (!parsed) {
        return c.text("Invalid!", 401);
      }
      return parsed;
    }),
    async (c) => {
      await authenticateUser(c);

      const vehicle = c.req.valid("form");

      if ((await checkVehicleExists(vehicle.stockId)) == 0) {
        throw new HTTPException(400, { message: "Vehicle already exists" });
      }

      // Upload Images to AWS
      const uploadRes = await PostImagesToS3(vehicle.stockId.toString(), vehicle.stockId.toString(), vehicle.images);
      if (uploadRes.error != PostImageError.NoError) throw new HTTPException(500, { message: uploadRes.error.toString() });

      console.log("uploaded Images: ", uploadRes.images);

      try {
        return c.json(
          await db.vehicle.create({
            data: createVehicleObject(vehicle, uploadRes.images),
          })
        );
      } catch (error) {
        await DeleteImagesInS3(uploadRes.images.map((image) => image.url));
        console.log("Deleted Created Images");
        // Catch any expected prisma errors
        throw new HTTPException(500, {
          message: "Failed to create vehicle",
          cause: error,
        });
      }
    }
  )
  /**
   * Path ---> "/api/vehicles/:stockId"
   * GET specific vehicle
   */
  .get("/:stockid", async (c) => {
    await authenticateUser(c);
    const stockId = parseInt(c.req.param("stockid"));
    return c.json(
      await db.vehicle.findUnique({
        where: { stockId: stockId, title: { not: "107" } },
      })
    );
  })
  /**
   * Path ---> "/api/vehicles/:stockId"
   * Update specific vehicle
   */
  .post(
    "/:stockid",
    validator("form", (value, c) => {
      const parsed = ParseVehicleFormData(value);
      if (!parsed) {
        return c.text("Invalid!", 401);
      }
      return parsed;
    }),
    async (c) => {
      await authenticateUser(c);
      const formVehicle = c.req.valid("form");

      if (formVehicle.stockId != parseInt(c.req.param("stockid"))) {
        throw new HTTPException(400, { message: "Insecure Request Found" });
      }

      if (!formVehicle.imagesOrder || formVehicle.imagesOrder.length < 0)
        throw new HTTPException(400, { message: "Missing imagesOrder" });

      // Ensure Vehicle exists
      if ((await checkVehicleExists(formVehicle.stockId)) !== formVehicle.stockId) {
        throw new HTTPException(404, { message: "Vehicle not found" });
      }

      // // Delete Images from AWS
      if (formVehicle.deletedImages && formVehicle.deletedImages.length > 0) {
        try {
          await DeleteImagesInS3(formVehicle.images.map((image) => image.url));
        } catch (err) {
          throw new HTTPException(500, {
            message: `Unable to delete images. Error: ${err as Error}`,
          });
        }
      }

      console.log("Images are deleted");
      const { images, error } = await manageImages(
        formVehicle.stockId,
        formVehicle.images,
        formVehicle.imagesOrder,
        AWS_S3_BASE_URL
      );
      if (error) throw new HTTPException(500, { message: error });

      console.log("Images are uploaded!");

      return c.json(
        await db.vehicle.update({
          where: { stockId: formVehicle.stockId },
          data: createVehicleObject(formVehicle, images),
        })
      );
    }
  )
  /**
   * Path ---> "/api/vehicles/:stockId"
   * Delete specific vehicle
   */
  .post("/:stockid/delete", async (c) => {
    await authenticateUser(c);
    const stockid = parseInt(c.req.param("stockid"));

    // Get the Images from the vehicle
    const vehicle = await db.vehicle.findUnique({
      where: { stockId: stockid },
      select: { images: true },
    });

    if (!vehicle) throw new HTTPException(404, { message: "Vehicle not found" });

    // Delete Images from AWS
    try {
      await DeleteImagesInS3(vehicle.images);
    } catch {
      throw new HTTPException(500, { message: "Unable to delete images" });
    }

    // Update title on Vehicle
    return c.json(
      await db.vehicle.update({
        where: { stockId: stockid },
        data: { title: "107" },
      })
    );
  });

/**
 * Checks if Vehcile (stockId) exists in the DB
 * @param stockId Vehicle to search for
 * @returns 0 if Vehicle is not found
 */
async function checkVehicleExists(stockId: number) {
  return await db.vehicle
    .findUnique({
      where: {
        stockId: stockId,
      },
      select: { stockId: true },
    })
    .then((res) => (res ? res.stockId : 0));
}

async function manageImages(
  stockId: number,
  images: any[],
  imagesOrder: string[],
  BASE_URL: string
): Promise<{ images: UploadedImages[]; error: string }> {
  let newImages: UploadedImages[] = [];
  let uploadRes: PostImagesResponse;

  // Skip uploading and formatting if there are no new images
  if (images.length > 0) {
    uploadRes = await PostImagesToS3(stockId.toString(), stockId.toString(), images);
    if (uploadRes.error != PostImageError.NoError) return { images: [], error: uploadRes.error.toString() };
  }

  // Ensure Uploaded & existing images are in the correct order - By matching Names and URLs
  imagesOrder.forEach((imageId) => {
    // Push straight if it's a URL
    if (imageId.startsWith(BASE_URL)) return newImages.push({ fileName: imageId, url: imageId });

    // Find uploaded image that matches fileName
    uploadRes.images.forEach((image) => image.fileName === imageId && newImages.push(image));
  });

  return { images: newImages, error: "" };
}

/**
 *
 * @param c API Context
 * @returns Authenticated user
 */
export function authenticateUser(c: Context) {
  // Get the current user
  const auth = getAuth(c);

  // Ensure user is signed in
  if (!auth?.userId) {
    const errorResponse = new Response("Unauthorized Request", {
      status: 401,
      headers: {
        Authenticate: 'error="invalid_token"',
      },
    });
    throw new HTTPException(401, { res: errorResponse });
  }

  return auth;
}
