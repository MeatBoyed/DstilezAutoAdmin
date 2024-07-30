import { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Resend } from "resend";

// TODO: Implement filtering of Delted Vehicles where applicable
export const FeedBackFormSchema = z.object({
  subject: z.string().min(3, { message: "Subject must be at least 3 characters long." }),
  email: z.string().email({ message: "Email address must be valid." }).optional(),
  message: z.string().min(10, {
    message: "Please enter a short message, longer than 10 characters.",
  }),
  stockId: z.string().min(3, { message: "StockId is required" }).optional(),
  userId: z.string().min(3, { message: "UserId is required" }),
});

// const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_KEY = "re_HRYCSX9u_C4NTyRd3uTjSWPUeHXC1mkEM";
console.log("RESEND_API_KEY: ", RESEND_API_KEY);
if (RESEND_API_KEY === undefined) {
  throw new Error("RESEND_API_KEY is undefined");
}

export default new Hono()
  /**
   * Path ---> "/api/feedback"
   * Create Feedback Message (POST)
   */
  .post("/", zValidator("json", FeedBackFormSchema), async (c) => {
    await authenticateUser(c);

    const feedback = c.req.valid("json");

    const resend = new Resend(RESEND_API_KEY);

    // Send Object via email
    const { data, error } = await resend.emails.send({
      //   from: 'onboarding@resend.dev',
      to: "charliejrcool@gmail.com",
      from: "feedback@nerfdesigns.com",
      subject: `DS Tilez Auto Admin - ${feedback.subject}`,
      html: `Meta Data: \nEmail :${feedback.email}\nReferenced StockId: ${feedback.stockId}\nUserId: ${feedback.userId}\n\n\n${feedback.message}`,
    });

    if (error) throw new HTTPException(500, { cause: error, message: error.message });

    return c.json(data);
  });

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
