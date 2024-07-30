import { honoClient } from "@/app/api/[[...route]]/route";
import { VehicleFormSchema } from "@/lib/Formlibs";
import { InferRequestType } from "hono";
import { VehicleToFormData } from "./util/FormDataConverters";
import { z } from "zod";
import { FeedBackFormSchema } from "./controllers/feedbackController";

// const $put = honoClient.vehicle.create.$put;
// export const PostVehicle = (arg: InferRequestType<typeof $put>) => async () =>
//   await $put(arg).then(async (res) => await res.json());

export async function PostVehicle(
  url: string,
  {
    arg,
  }: {
    arg: {
      vehicle: z.infer<typeof VehicleFormSchema>;
    };
  }
) {
  return fetch(url, {
    method: "POST",
    body: VehicleToFormData(arg.vehicle),
  }).then((res) => res.json());
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
