import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { clerkMiddleware } from "@hono/clerk-auth";

import feedbackController from "@/server/controllers/feedbackController";
import vehicleController from "../../../server/controllers/vehicleController";

// const app = new Hono()
//   .use(logger())
//   .use(clerkMiddleware())
//   .basePath("/api")
//   .route("/vehicles", vehicleController)
//   .route("/feedback", feedbackController);
const app = new Hono().basePath("/api");

app.use(logger());
app.use(clerkMiddleware());
app.route("/vehicles", vehicleController);
app.route("/feedback", feedbackController);
// const app = new Hono().basePath("/api").route("/", routes);

// export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
