import { VehicleFormSchema } from "@/lib/Formlibs";
import { z } from "zod";

/**
 * Converts the Form Schema into a valid FormData
 * @param vehicle VehicleFormSchema - zod schema
 * @returns FormData
 */
export function VehicleToFormData(
  vehicle: z.infer<typeof VehicleFormSchema>
): FormData {
  const formData = new FormData();

  // Meta
  formData.append("stockId", vehicle.stockId.toString());
  formData.append("title", vehicle.title);
  formData.append("price", vehicle.price.toString());

  // Core
  formData.append("make", vehicle.make);
  formData.append("model", vehicle.model);
  formData.append("variant", vehicle.variant);
  formData.append("milage", vehicle.milage.toString());
  formData.append("year", vehicle.year.toString());

  // Details
  formData.append("transmission", vehicle.transmission);
  formData.append("fuelType", vehicle.fuelType);
  formData.append("condition", vehicle.condition);
  formData.append("bodyType", vehicle.bodyType);
  formData.append("color", vehicle.color);

  // Meta
  formData.append("newUsed", vehicle.newUsed);
  formData.append("mmCode", vehicle.mmCode.toString());

  // Extras
  for (let i = 0; i < vehicle.extras.length; i++) {
    formData.append(`extras[${i}]`, vehicle.extras[i].text);
  }

  // Images
  for (let i = 0; i < vehicle.images.length; i++) {
    formData.append(`images[${i}]`, vehicle.images[i] as File);
  }
  if (vehicle.imagesOrder) {
    for (let i = 0; i < vehicle.imagesOrder.length; i++) {
      formData.append(`imagesOrder[${i}]`, vehicle.imagesOrder[i]);
    }
  }
  if (vehicle.deletedImages) {
    for (let i = 0; i < vehicle.deletedImages.length; i++) {
      formData.append(
        `deletedImages[${i}]`,
        vehicle.deletedImages[i] as string
      );
    }
  }

  return formData;
}

/**
 * Converts the Form Schema into a valid FormData
 * @param formData Record<string, string | File> | FormData - Received FormData
 * @returns VehicleFormSchema - zod schema
 */
export const ParseVehicleFormData = (
  formData: Record<string, string | File> | FormData
): z.infer<typeof VehicleFormSchema> => {
  const data: Record<string, any> = {};

  // Set's data with keys & values of FormData
  if (formData instanceof FormData) {
    formData.forEach((value, key) => {
      if (key.includes("[")) {
        // Handling array fields like extraFeatures
        const [mainKey, index, subKey] = key.match(/[^[\]]+/g) as string[];
        if (!data[mainKey]) data[mainKey] = [];
        if (!data[mainKey][index]) data[mainKey][index] = {};
        data[mainKey][index][subKey] = value;
      } else {
        data[key] = value;
      }
    });
  } else {
    Object.entries(formData).forEach(([key, value]) => {
      if (key.includes("[")) {
        // Handling array fields like extraFeatures
        const [mainKey, index, subKey] = key.match(/[^[\]]+/g) as string[];
        if (!data[mainKey]) data[mainKey] = [];
        if (!data[mainKey][index]) data[mainKey][index] = {};
        data[mainKey][index][subKey] = value;
      } else {
        data[key] = value;
      }
    });
  }

  // Extras
  let extras: string[] = [];
  if (Array.isArray(data.extras)) {
    data.extras.forEach((feature) => {
      extras.push(feature.undefined);
    });
  }

  // Images
  let images: File[] = [];
  if (Array.isArray(data.images)) {
    data.images.forEach((image) => {
      if (image.undefined instanceof File) images.push(image.undefined as File);
    });
  }

  let imagesOrder: string[] = [];
  if (Array.isArray(data.imagesOrder)) {
    data.imagesOrder.forEach((order) => {
      imagesOrder.push(order.undefined);
    });
  }

  let deletedImages: File[] = [];
  if (Array.isArray(data.deletedImages)) {
    data.deletedImages.forEach((image) => {
      if (typeof image.undefined === "string")
        deletedImages.push(image.undefined);
    });
  }

  // Convert the data types as needed
  const vehicle = {
    ...data,
    //   Meta
    stockId: data.stockId,
    title: data.title,
    price: parseFloat(data.price),

    //   Core
    make: data.make,
    model: data.model,
    variant: data.variant,
    milage: data.milage,
    year: parseInt(data.year),

    //   Detials
    transmission: data.transmission,
    fuelType: data.fuelType,
    condition: data.condition,
    bodyType: data.bodyType,
    color: data.color,

    //   Others
    newUsed: data.newUsed,
    mmCode: data.mmCode,

    images: images,
    extras: extras.map((extra, index) => {
      return { id: index.toString(), text: extra };
    }),
    deletedImages: deletedImages,
    imagesOrder: imagesOrder,
  };

  return VehicleFormSchema.parse(vehicle);
};
