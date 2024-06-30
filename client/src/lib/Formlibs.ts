import { z } from "zod";
import {
  BodyTypes,
  Colours,
  FuelTypes,
  Makes,
  Transmissions,
} from "./formData";

export const MINFILES = 1;
export const MAXFILES = 12;

// Property Form UTILS
export const VehicleFormSchema = z.object({
  stockId: z.coerce.number({
    required_error: "StockID is required",
    invalid_type_error: "StockID must be an int",
  }),
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title must be a string.",
    })
    .min(5, { message: "Title must be at least 5 characters long." }),
  make: z.enum(Makes, {
    required_error: "Description is required.",
    invalid_type_error: "Description must be a string.",
  }),
  model: z
    .string({
      required_error: "Model is required.",
      invalid_type_error: "Model must be a string.",
    })
    .min(5, { message: "variant must be at least 5 characters long." }),
  variant: z
    .string({
      required_error: "variant is required.",
      invalid_type_error: "variant must be a string.",
    })
    .min(5, { message: "variant must be at least 5 characters long." }),

  price: z.coerce
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a number.",
    })
    .positive({ message: "Price must be a positive number." }),
  milage: z.coerce
    .number({
      required_error: "Milage is required.",
      invalid_type_error: "Milage must be a number.",
    })
    .min(1, { message: "There must be at least 1km for Milage ." }),
  year: z.coerce
    .number({
      required_error: "Number of Years is required.",
      invalid_type_error: "Years must be a number.",
    })
    .min(1, { message: "Number of year is not valid" }),
  color: z.enum(Colours, {
    required_error: "Colour is required.",
    invalid_type_error: "Colour must be a boolean.",
  }),
  transmission: z.enum(Transmissions, {
    required_error: "Transmission is required.",
    invalid_type_error: "Transmission must be either Manual or Automaitc.",
  }),
  fuelType: z.enum(FuelTypes, {
    required_error: "Fuel type is required",
    invalid_type_error: "Fuel type must be either Petrol, Diesel, or Electric",
  }),
  extras: z
    .array(
      z.object({
        id: z.string({
          required_error: "Feature ID is required.",
          invalid_type_error: "Feature ID must be a string.",
        }),
        text: z.string({
          required_error: "Feature text is required.",
          invalid_type_error: "Feature text must be a string.",
        }),
      })
    )
    .min(1, { message: "There must be at least one extra feature." }),
  condition: z.string().min(1),
  images: z
    .array(typeof window === "undefined" ? z.any() : z.instanceof(File))
    // .min(1, { message: `There must be at least ${MINFILES} Image.` })
    .max(MAXFILES, { message: `No more than ${MAXFILES} Images allowed.` }),
  bodyType: z.enum(BodyTypes, {
    required_error: "Body type  is required.",
    invalid_type_error: "Body type must be a string.",
  }),
  newUsed: z.enum(["New", "Used"], {
    required_error: "New or Used is required",
    invalid_type_error: "New or used must be either Sale or Rent",
  }),
  mmCode: z.coerce.number({
    required_error: "MM Code is required",
    invalid_type_error: "MM Code must be a number",
  }),
  imagesOrder: z.string().array().optional(),
  deletedImages: z.string().array().optional(),
});
