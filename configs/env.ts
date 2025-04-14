import * as z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string(),
  NEXT_PUBLIC_JWT_SECRET: z.string(),
});

const envParser = envSchema.safeParse({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
});

if (!envParser.success) {
  console.error(envParser.error.issues);
  throw new Error("The values ​in the env file are invalid");
}

export default envParser.data;
