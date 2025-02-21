import * as z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string(),
});

const envParser = envSchema.safeParse({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
});

if (!envParser.success) {
  console.error(envParser.error.issues);
  throw new Error("The values ​in the env file are invalid");
}

export default envParser.data;
