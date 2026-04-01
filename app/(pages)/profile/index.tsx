import { z } from "zod";
export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-z ]+$/, { message: "Only letters are allowed" }),
  // birthday: z.object({
  month: z.string().min(1, { message: "Month is required" }),
  day: z.string().min(1, { message: "Day is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  // }),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  englishLevel: z.string().min(1, { message: "English level is required" }),
  languages: z
  .array(z.string()).min(0)
  .max(3, { message: "You can select up to 3 interests" }),
  maritalStatus: z.string().optional(),
  fieldOfWork: z.string().min(1, { message: "Field of work is required" }),
  traits: z
    .array(z.string())
    .max(3, { message: "You can select up to 3 traits" }),
  interests: z
    .array(z.string())
    .max(5, { message: "You can select up to 5 interests" }),
  movies: z
    .array(z.string())
    .max(3, { message: "You can select up to 3 movies" }),
  music: z
    .array(z.string())
    .max(3, { message: "You can select up to 3 music genres" }),
  lookingFor: z
    .array(z.string())
    .max(3, { message: "You can select up to 3 goals" }),
  ageRange: z.any(),
  gender: z.string().min(1, { message: "Gender is required" }),
  personality: z.string().min(1, { message: "Personality is required" }),
  story: z.string().optional(),
});