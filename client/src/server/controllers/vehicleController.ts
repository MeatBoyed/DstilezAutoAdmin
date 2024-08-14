import { Context, Hono } from "hono";
import db from "../util/database";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { ParseVehicleFormData } from "../util/FormDataConverters";
import { createVehicleObject } from "../util/utils";
import { PostImageError, PostImagesResponse, UploadedImages } from "@/components/UploadShad/server/honoS3Types";
import { DeleteImagesInS3, PostImagesToS3 } from "@/components/UploadShad/server/HonoS3";
import { getAuth } from "@hono/clerk-auth";
import { VehiclePaginationRequest } from "../util/BusinessLogic";
import S3Service from "@/components/Upload-Shad/main/server/S3Service";
import BusinessLayer from "../lib/BusinessLayer";
import { VehicleSchema } from "@/lib/Formlibs";
import { zValidator } from "@hono/zod-validator";

// TODO: Implement filtering of Delted Vehicles where applicable

const VEHICLES_PER_PAGE = 8;
const AWS_S3_BASE_URL = process.env.NEXT_PUBLIC_AWS_S3_BASE_URL;
if (AWS_S3_BASE_URL === undefined) {
  throw new Error("AWS_S3_BASE_URL is undefined");
}

const s3Service = new S3Service();
const businessLayer = new BusinessLayer();

export default new Hono()
  /**
   * Path ---> "/api/vehicles?searchquery"
   * GET all vehicles
   */
  .get("/", async (c) => {
    await authenticateUser(c);

    const { page, pageSize, order, make, fueltype, transmission, bodytype, color } = c.req.query();

    return c.json(
      await VehiclePaginationRequest({
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
  .get("/params", async (c) => {
    return c.json(
      await db.vehicle.findMany({
        where: { title: { not: "107" } },
        select: { stockId: true },
      })
    );
  })
  /**
   * Path ---> "/api/vehicles"
   * Create vehicle (POST)
   */
  .post("/", async (c) => {
    await authenticateUser(c); // Auth

    const rawVehicle = await c.req.json(); // Payload
    const vehicle = await VehicleSchema.safeParseAsync(rawVehicle);
    if (!vehicle.success) throw new HTTPException(400, { message: "Invalid vehicle data" });

    const response = await businessLayer.CreateVehicle(vehicle.data); // Offload and handle errors
    if (response.failure || !response.success) throw new HTTPException(500, { message: response.message });

    return c.json(response.success); // return response directly
  })

  /**
   * Path ---> "/api/vehicles/:stockId"
   * GET specific vehicle
   */
  .get("/:stockid", async (c) => {
    await authenticateUser(c); // Auth

    const stockId = parseInt(c.req.param("stockid")); // Payload

    // Access database directly is fine as it's very simple request
    // Improve by removing "107" delete state
    const vehicle = await db.vehicle.findUnique({
      where: { stockId: stockId, title: { not: "107" } },
    });

    // handle necessary errors
    if (!vehicle) throw new HTTPException(404, { message: "Vehicle not found" });

    // console.log("API: Fetch Vehicle: ", vehicle);
    return c.json(vehicle); // return response directly
  })
  /**
   * Path ---> "/api/vehicles/:stockId"
   * Update specific vehicle
   */
  .post("/:stockid", async (c) => {
    await authenticateUser(c); // Auth

    const rawVehicle = await c.req.json(); // Payload
    const vehicle = await VehicleSchema.safeParseAsync(rawVehicle);
    if (!vehicle.success) throw new HTTPException(400, { message: "Invalid vehicle data" });
    if (vehicle.data.stockId != parseInt(c.req.param("stockid"))) {
      throw new HTTPException(400, { message: "Insecure Request Found" });
    }

    // Ensure Vehicle exists
    if ((await checkVehicleExists(vehicle.data.stockId)) !== vehicle.data.stockId) {
      throw new HTTPException(404, { message: "Vehicle not found" });
    }

    return c.json(
      await db.vehicle.update({
        where: { stockId: vehicle.data.stockId },
        data: {
          ...vehicle.data,
          extras: vehicle.data.extras.map((extra) => extra.text),
        },
      })
    );
  })
  /**
   * Path ---> "/api/vehicles/:stockId"
   * Delete specific vehicle
   */
  .post("/:stockid/delete", async (c) => {
    await authenticateUser(c); // Auth

    const stockid = parseInt(c.req.param("stockid")); // Payload

    const response = await businessLayer.DeleteVehicle(stockid); // Offload and handle errors
    if (response.failure || !response.success) throw new HTTPException(500, { message: response.message });

    return c.json(response.success); // return response directly
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
