import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { clerkMiddleware } from "@hono/clerk-auth";

import feedbackController from "@/server/controllers/feedbackController";
import vehicleController from "@/server/controllers/vehicleController";
import leadsController from "@/server/controllers/leadsController";
import imagesController from "@/server/controllers/imagesController";

const app = new Hono().basePath("/api");

app.use(logger());
app.use(clerkMiddleware());
app.route("/vehicles", vehicleController);
app.route("/feedback", feedbackController);
app.route("/leads", leadsController);
app.route("/images", imagesController);

export const GET = handle(app);
export const POST = handle(app);
