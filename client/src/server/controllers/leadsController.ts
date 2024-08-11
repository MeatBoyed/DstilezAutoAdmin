import { getAuth } from "@hono/clerk-auth";
import { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { LeadPaginationRequest } from "../util/BusinessLogic";
import { boolean } from "zod";

const LEADS_PER_PAGE = 5;

export default new Hono()
  /**
   * Path ---> "/api/leads?searchParams"
   * Get Leads
   */
  .get("/", async (c) => {
    //   Authenticate user
    await authenticateUser(c);

    // Get search query
    const { page, pageSize, order, stockid, status, willtrade, requireFinance, requireRentToOwn, enquiryDate } = c.req.query();

    // Make Query to db
    return c.json(
      await LeadPaginationRequest({
        page: typeof page === "string" ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : LEADS_PER_PAGE,
        where: {
          stockId: stockid ? parseInt(stockid) : undefined,
          status: { mode: "insensitive", equals: status != "undefined" ? status : undefined },
          willTrade: willtrade === "true" ? true : willtrade === "false" ? false : undefined,
          requireFinance: requireFinance === "true" ? true : requireFinance === "false" ? false : undefined,
          requireRentToOwn: requireRentToOwn === "true" ? true : requireRentToOwn === "false" ? false : undefined,
          enquiryDate: enquiryDate ? new Date(enquiryDate) : undefined,
        },
      })
    );

    // return c.json({ ok: true });
  })

  /**
   * Path ---> "/api/leads/forward"
   * Forward Lead via Email
   */
  .post("/forward", async (c) => {
    //   Authenticate user
    await authenticateUser(c);

    // Get Form data

    // Send Email with form Data

    return c.json({ ok: true });
  })

  /**
   * Path --> "/leads/:leadId"
   * Update Lead (Status)
   */
  .post("/:leadId", async (c) => {
    //   Authenticate user
    await authenticateUser(c);

    // Get form data

    // Update on data

    return c.json({ ok: true });
  });

/**
 *
 * @param c API Context
 * @returns Authenticated user
 */
function authenticateUser(c: Context) {
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
