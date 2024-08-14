import { VehicleFormSchema, VehicleSchema } from "@/lib/Formlibs";
import { VehicleToFormData } from "./util/FormDataConverters";
import { z } from "zod";
import { FeedBackFormSchema } from "./controllers/feedbackController";

// NOTE: These methods are implicitaly run client side, therefore no Authentication header is being used

export async function PostVehicle(
  url: string,
  {
    arg,
  }: {
    arg: {
      vehicle: z.infer<typeof VehicleSchema>;
    };
  }
) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(arg.vehicle),
  }).then((res) => {
    console.log("Response: ", res);
    return res.json();
  });
}

export async function DeleteVehicle(url: string) {
  return fetch(url, {
    method: "POST",
  }).then((res) => res.json());
}

export async function PostFeedBack(
  url: string,
  {
    arg,
  }: {
    arg: {
      feedback: z.infer<typeof FeedBackFormSchema>;
    };
  }
) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(arg.feedback),
  }).then((res) => res.json());
}
