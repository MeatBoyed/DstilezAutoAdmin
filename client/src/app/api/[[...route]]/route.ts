import { Hono } from "hono";
import { handle } from "hono/vercel";
import { hc } from "hono/client";
import { logger } from "hono/logger";
import { clerkMiddleware } from "@hono/clerk-auth";

import feedbackController from "@/server/controllers/feedbackController";
import vehicleController from "../../../server/controllers/vehicleController";

const BASE_URL = process.env.NEXT_PUBLIC_HOST_URL;
if (BASE_URL === undefined) throw new Error("NEXT_PUBLIC_HOST_URL is undefined");

const routes = new Hono()
  .use(logger())
  .use(clerkMiddleware())
  .route("/vehicles", vehicleController)
  .route("/feedback", feedbackController);
const app = new Hono().basePath("/api").route("/", routes);

// export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);

export const honoClient = hc<typeof routes>("/api");
export const honoRPCClient = hc<typeof routes>(`${BASE_URL}/api`);
