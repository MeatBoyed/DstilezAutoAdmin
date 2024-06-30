"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tag, TagInput } from "emblor";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Eye, Save, Trash2 } from "lucide-react";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import {
//   VehicleSchema,
//   SelectBedroomsOptions,
//   SelectBathroomsOptions,
//   SelectVisibilityOptions,
//   SelectSaleTypeOptions,
//   MAXFILES,
//   VehicleToFormData,
// } from "../../lib/FormUtils";
import useSWRMutation from "swr/mutation";
// import { toast } from "sonner";
// import { ImagesInput } from "@/components/ImagesInput";
// import {
//   DeleteVehicle,
//   PostVehicle,
//   PostVehicleResponse,
// } from "@/lib/RequestUtils";
// import { VehicleWithAddress } from "@/app/api/(utils)/utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import image from "next/image";
import { VehicleFormSchema } from "@/lib/Formlibs";
import {
  SelectBodyTypes,
  SelectColours,
  SelectFuelTypes,
  SelectMakes,
  SelectTransmissions,
} from "@/lib/formData";

export default function VehicleForm({
  initVehicle,
}: {
  initVehicle?: boolean;
}) {
  const router = useRouter();

  const defaultValues: z.infer<typeof VehicleFormSchema> = {
    stockId: 0,
    title: "",
    make: "Abarth",
    model: "",
    variant: "",
    price: 0,
    milage: 0,
    year: 0,
    color: "White",
    transmission: "Automatic",
    fuelType: "Petrol",
    extras: [],
    condition: "",
    images: [],
    bodyType: "Sedan",
    newUsed: "Used",
    mmCode: 0,
  };
  const form = useForm<z.infer<typeof VehicleFormSchema>>({
    resolver: zodResolver(VehicleFormSchema),
    defaultValues: defaultValues,
  });
  const { setValue, getValues, formState } = form;
  console.log("Values: ", getValues());
  console.log("Errors: ", formState.errors);

  // Extra Features's Tag management
  const [activeExtraTagIndex, setActiveExtraTagIndex] = useState<number | null>(
    null
  );

  //   const {
  //     trigger: triggerCreate,
  //     isMutating: isMutatingCreate,
  //     error: createError,
  //   } = useSWRMutation("/api/vehicle/create", PostVehicle /* options */, {
  //     onError: (error) => {
  //       console.log("Server Error Occured: ", error);
  //       toast.error("Something unexpected happend.", {
  //         description: "Please try again....",
  //       });
  //     },
  //     onSuccess: (data) => {
  //       console.log(data);
  //       if (data.error === "Image is required") {
  //         toast.error("Ooops! Looks like you forgot to add images.", {
  //           description: "You must upload at least 2 Images for your post.",
  //           duration: 500000,
  //         });
  //         return;
  //       }
  //       if (data.error === "Unable to upload image") {
  //         toast.error(
  //           "Ooops! Something went wrong when uploading your images. Please try again",
  //           {
  //             duration: 500000,
  //           }
  //         );
  //         return;
  //       }

  //       if (data) {
  //         // Show message
  //         toast.success("Your Vehicle has been posted!", {
  //           description: `View your Vehicle at ....`,
  //         });
  //         router.push(`/dashboard/Vehicle/${data.Vehicle_id}`);
  //       }
  //     },
  //   });

  //   const {
  //     trigger: triggerUpdate,
  //     isMutating: isMutatingUpdate,
  //     error: updateError,
  //   } = useSWRMutation("/api/vehicle/update", PostVehicle /* options */, {
  //     onError: (error) => {
  //       console.log("SERVER RESPONSE ERROR: ", error);
  //       toast.error("Something unexpected happend.", {
  //         description: "Please try again....",
  //       });
  //     },
  //     onSuccess: (data: VehicleWithAddress) => {
  //       const createdProp: z.infer<typeof VehicleSchema> = {};

  //       // Set result (Vehicle) value to the Form's state, convert object values..
  //       form.reset(createdProp);

  //       // Show message
  //       toast.success("Your Vehicle has been Updated!", {
  //         description: `View your Vehicle at ....`,
  //       });
  //     },
  //   });

  //   const {
  //     trigger: triggerDelete,
  //     isMutating: isMutatingDelete,
  //     error: deleteError,
  //   } = useSWRMutation(
  //     `/api/vehicle/delete/${initVehicle ? initVehicle.Vehicle_id : ""}`,
  //     DeleteVehicle /* options */,
  //     {
  //       onError: () => {
  //         toast.error("Something unexpected happend.", {
  //           description: "Please try again....",
  //         });
  //       },
  //       onSuccess: (data) => {
  //         // Show message
  //         toast.success("Your Vehicle has been Deleted!");
  //       },
  //     }
  //   );

  //   async function submitHandler(values: z.infer<typeof VehicleSchema>) {
  //     console.log("Hello!");
  //     console.log("Submitted Form: ", values);

  //     if (!initVehicle) {
  //       await triggerCreate({ Vehicle: values });
  //     } else {
  //       await triggerUpdate({
  //         Vehicle: values,
  //       });
  //     }
  //   }

  //   async function deleteHandler() {
  //     if (!initVehicle || !user) return;

  //     await triggerDelete({
  //       payload: {
  //         VehicleId: initVehicle.Vehicle_id,
  //         userId: user.id,
  //         images: initVehicle.images,
  //       },
  //     });
  //     router.push("/dashboard/Vehicle");
  //   }

  return (
    <>
      {/* {isMutatingCreate || isMutatingUpdate || isMutatingDelete ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <PuffLoader color="blue" />
        </div>
      ) : ( */}
      <Form {...form}>
        <form
          // onSubmit={form.handleSubmit(submitHandler)}
          className="h-full w-full flex justify-start items-center flex-col gap-12"
        >
          {/* Head (Action Btns) */}
          <div className="flex items-center justify-between w-full sm:px-5 lg:max-w-7xl flex-wrap gap-4">
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-white hidden sm:flex"
                type="button"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {!initVehicle ? "Create Vehicle" : "Edit Vehicle"}
              </h1>
            </div>
            <div className="flex justify-center items-center gap-2">
              {initVehicle && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"destructive"} size="sm" className="gap-2">
                      <Trash2 size={16} className="text-black" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Warning! This is can not be undone.
                      </DialogTitle>
                      <DialogDescription>
                        Deleting this image will be a permanent action, and can
                        not be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter
                      style={{ justifyContent: "space-between" }}
                      className="flex p-0 m-0 justify-between items-center w-full"
                    >
                      <p className="text-sm font-normal ">
                        Are you sure you want to do this?
                      </p>
                      <Button
                        variant={"destructive"}
                        type="button"
                        //   onClick={async () => await deleteHandler()}
                      >
                        Confirm Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="gap-2"
              >
                <Save size={16} />
                {initVehicle ? "Save" : "Create"}
              </Button>
            </div>
          </div>

          {/* Form Inputs */}
          {/* <div className="flex justify-start items-center w-full gap-10 flex-col sm:flex-row sm:items-start  sm:px-5 lg:max-w-7xl"> */}
          <div className="grid grid-cols-1 w-full gap-10 sm:grid-cols-2 sm:items-start sm:px-5 lg:max-w-7xl">
            <div className="flex flex-col justify-center items-center w-full gap-5">
              {/* Meta fields */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                  <CardDescription>
                    Easily add your Vehicle in 10 minutes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Stock Id */}
                    <FormField
                      control={form.control}
                      name="stockId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock ID</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="text"
                              placeholder="Give your Vehicle a title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Core fields */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                  <CardDescription>
                    Easily add your Vehicle in 10 minutes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Make */}
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select the make" />
                              </SelectTrigger>
                              <SelectContent className="">
                                <SelectGroup>
                                  <SelectLabel>Make</SelectLabel>
                                  {SelectMakes.map((option) => (
                                    <SelectItem
                                      key={option.key}
                                      value={option.value}
                                    >
                                      {option.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Model */}
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input className="w-full" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Variant */}
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant</FormLabel>
                          <FormControl>
                            <Input className="w-full" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Milage */}
                    <FormField
                      control={form.control}
                      name="milage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Milage</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Year */}
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              {/* Image Input */}
            </div>
            <div className="flex flex-col-reverse sm:flex-col justify-center items-center w-full gap-5">
              {/* Details fields */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                  <CardDescription>
                    Easily add your Vehicle in 10 minutes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Transmission */}
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transmission</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select the Transmission" />
                              </SelectTrigger>
                              <SelectContent className="">
                                <SelectGroup>
                                  <SelectLabel>Transmission</SelectLabel>
                                  {SelectTransmissions.map((option) => (
                                    <SelectItem
                                      key={option.key}
                                      value={option.value}
                                    >
                                      {option.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Fuel Type */}
                    <FormField
                      control={form.control}
                      name="fuelType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select the Fuel type" />
                              </SelectTrigger>
                              <SelectContent className="">
                                <SelectGroup>
                                  <SelectLabel>Fuel type</SelectLabel>
                                  {SelectFuelTypes.map((option) => (
                                    <SelectItem
                                      key={option.key}
                                      value={option.value}
                                    >
                                      {option.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Body Type */}
                    <FormField
                      control={form.control}
                      name="bodyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select the Body type" />
                              </SelectTrigger>
                              <SelectContent className="">
                                <SelectGroup>
                                  <SelectLabel>Make</SelectLabel>
                                  {SelectBodyTypes.map((option) => (
                                    <SelectItem
                                      key={option.key}
                                      value={option.value}
                                    >
                                      {option.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Colour */}
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select the Colour" />
                              </SelectTrigger>
                              <SelectContent className="">
                                <SelectGroup>
                                  <SelectLabel>Make</SelectLabel>
                                  {SelectColours.map((option) => (
                                    <SelectItem
                                      key={option.key}
                                      value={option.value}
                                    >
                                      {option.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Extra Features */}
                    <FormField
                      control={form.control}
                      name="extras"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extra Features</FormLabel>
                          <FormControl>
                            <TagInput
                              {...field}
                              clearAll
                              variant="Primary"
                              sortTags={true}
                              includeTagsInInput={false}
                              activeTagIndex={activeExtraTagIndex}
                              setActiveTagIndex={setActiveExtraTagIndex}
                              placeholder="Enter a feature"
                              tags={field.value}
                              className=" w-full "
                              setTags={(newTags) => {
                                setValue("extras", newTags as [Tag, ...Tag[]]);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      {/* )} */}
    </>
  );
}
