import { getAuth } from "@hono/clerk-auth";
import { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export default new Hono()

  /**
   * Path ---> "/api/leads?searchParams"
   * Get Leads
   */
  .get("/", async (c) => {
    //   Authenticate user
    await authenticateUser(c);
    return c.json({ ok: true });
  })

  /**
   * Path ---> "/api/leads/forward"
   * Forward Lead via Email
   */
  .post("/forward", async (c) => {
    //   Authenticate user
    await authenticateUser(c);

    return c.json({ ok: true });
  })

  /**
   * Path --> "/leads/:leadId"
   * Update Lead (Status)
   */
  .post("/:leadId", async (c) => {
    //   Authenticate user
    await authenticateUser(c);

    return c.json({ ok: true });
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
