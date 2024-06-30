import { Hono } from "hono";
import { handle } from "hono/vercel";
import vehicleController from "../controllers/vehicleController";

// Increase performance by using either Drizzle, or Prisma Accelerate
// export const runtime = "edge";

// app.use(clerkMiddleware());
const app = new Hono().basePath("/api").route("/vehicle", vehicleController);

export const GET = handle(app);
export const POST = handle(app);
