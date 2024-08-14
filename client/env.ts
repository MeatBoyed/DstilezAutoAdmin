import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DIRECT_URL: z.string().url(),
    DATABASE_URL: z.string().url(),

    // Clerk Auth
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),

    // Resend
    RESEND_API_KEY: z.string().min(1),

    // AWS
    AWS_BUCKET_NAME: z.string().min(1),
    AWS_BUCKET_REGION: z.string().min(1),
    AWS_BUCKET_ACCESS_KEY: z.string().min(1),
    AWS_BUCKET_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_BUCKET_PRODUCTION_FOLDER: z.string().min(1),
  },
  client: {
    // API
    NEXT_PUBLIC_HOST_URL: z.string().url(),

    // Clerk Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),

    // AWS
    NEXT_PUBLIC_AWS_BASE_URL: z.string().min(1),
  },
  //   For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    // API
    NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_HOST_URL,

    // Clerk Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,

    // AWS
    NEXT_PUBLIC_AWS_BASE_URL: process.env.NEXT_PUBLIC_AWS_BASE_URL,
  },
});
