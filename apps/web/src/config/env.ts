/* eslint-disable @typescript-eslint/no-namespace */
import { z } from "zod";

const envVars = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  EDGE_STORE_ACCESS_KEY: z.string().optional(),
  EDGE_STORE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_APP_EMAIL: z.string().email(),
  GOOGLE_ANALYTICS_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_SENDER_EMAIL: z.string().optional(),
  MERCADOPAGO_SUBSCRIPTIONS_ACCESS_TOKEN: z.string().optional(),
});

envVars.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}
