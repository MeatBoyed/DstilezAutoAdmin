import { Hono } from "hono";
import { handle } from "hono/vercel";
import vehicleController from "../controllers/vehicleController";
import { hc } from "hono/client";

// Increase performance by using either Drizzle, or Prisma Accelerate
// export const runtime = "edge";

// app.use(clerkMiddleware());

const routes = new Hono().route("/vehicle", vehicleController);
const app = new Hono().basePath("/api").route("/", routes);

// export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);

export const honoClient = hc<typeof routes>("/api");
