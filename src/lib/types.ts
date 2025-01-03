import { z } from "zod";

const userDataSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email().nullable(),
});

const fileDataSchema = z.object({
  title: z.string(),
  content: z.string(),
  link: z.string(),
  ownerId: z.string().nullable().optional(),
});


export { userDataSchema, fileDataSchema };
