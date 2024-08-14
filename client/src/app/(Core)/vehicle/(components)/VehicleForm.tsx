"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tag, TagInput } from "emblor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Eye, LoaderCircle, Save, Trash2, XCircle } from "lucide-react";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

import { MAXFILES, MINFILES, VehicleSchema } from "@/lib/Formlibs";
import {
  BodyTypes,
  Colours,
  FuelTypes,
  Makes,
  NewOrUsed,
  SelectBodyTypes,
  SelectColours,
  SelectFuelTypes,
  SelectMakes,
  Transmissions,
} from "@/lib/formData";
import { Vehicle } from "@prisma/client";
import { DeleteVehicle, PostVehicle } from "@/server/requestLib";
import { toast } from "sonner";
import { UploadShad } from "@/components/Upload-Shad/main/main";
import { HTTPException } from "hono/http-exception";
import { Badge } from "@/components/ui/badge";
import { s3Converter } from "@/server/util/BusinessLayer";
import FormHead from "./formHead";
import { FileInput } from "@/components/Upload-Shad/main/FileInput";
import FilesPreview from "@/components/Upload-Shad/main/FilesPreview";

const MAXSIZE = 5 * 1024 * 1024;
export default function VehicleForm({ initVehicle }: { initVehicle?: Vehicle }) {
  const router = useRouter();

  const getExtras = (extras: string[]) => {
    console.log("Extras: ", extras.length);
    // Check if extras is a single string
    if (extras.length < 2 && extras[0]?.split(",").length > 0) {
      const newExtras = extras[0]?.split(",");
      return newExtras.map((value, i) => {
        return { id: i.toString(), text: value };
      });
    }

    return extras.map((value, i) => {
      return { id: i.toString(), text: value };
    });
  };

  const defaultValues: z.infer<typeof VehicleSchema> = {
    stockId: initVehicle?.stockId || 0,
    title: initVehicle?.title || "",
    make: initVehicle ? Makes.find((make) => make == initVehicle.make) || "Alfa Romeo" : "Abarth",
    model: initVehicle?.model || "",
    variant: initVehicle?.variant || "",
    price: initVehicle?.price || 0,
    milage: initVehicle?.milage || 0,
    year: initVehicle?.year || 0,
    color: initVehicle ? Colours.find((value) => value === initVehicle.color) || "Black" : "White",
    transmission: initVehicle ? Transmissions.find((value) => value === initVehicle.transmission) || "Manual" : "Automatic",
    fuelType: initVehicle ? FuelTypes.find((value) => value === initVehicle.fuelType) || "Electric" : "Petrol",
    extras: initVehicle ? getExtras(initVehicle.extras) : [],
    condition: initVehicle?.condition || "",
    images: initVehicle?.images || [],
    bodyType: initVehicle ? BodyTypes.find((value) => value === initVehicle.bodyType) || "Convertible" : "Hatchback",
    newUsed: initVehicle ? NewOrUsed.find((value) => value === initVehicle.newUsed) || "Used" : "Used",
    mmCode: initVehicle?.mmCode || 0,
  };
  const form = useForm<z.infer<typeof VehicleSchema>>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: defaultValues,
  });
  const {
    setError,
    setValue,
    getValues,
    formState: { isDirty, isSubmitted, errors },
  } = form;
  console.log("Form Errors: ", errors);
  // Extra Features's Tag management
  const [activeExtraTagIndex, setActiveExtraTagIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isDirty && isSubmitted)
      Object.entries(errors).forEach(([key, value]) => {
        toast.error("Oops! Seems you've entered something wrong.", {
          description: value.message,
          duration: 10000,
        });
      });
  }, [errors, isDirty, isSubmitted]);

  const { trigger: triggerCreate, isMutating: isMutatingCreate } = useSWRMutation("/api/vehicles/", PostVehicle /* options */, {
    onError: (error: HTTPException) => {
      console.log("Server Error Occurred: ", error);
      toast.error("Something unexpected happened. Please try again", {
        description: `${error.message}`,
      });
    },
    onSuccess: (data: Vehicle) => {
      console.log("Received Data: ", data);
      toast.success("Your Vehicle has been uploaded!", {
        description: `View your Vehicle at ....`,
      });

      router.push(`/vehicle/${data.stockId}`);
    },
  });

  const { trigger: triggerUpdate, isMutating: isMutatingUpdate } = useSWRMutation(
    `/api/vehicles/${initVehicle?.stockId}`,
    PostVehicle,
    {
      onError: (error) => {
        console.log("Server Error Occurred: ", error);
        toast.error("Something unexpected happened. Please try again");
      },
      onSuccess: (data: Vehicle) => {
        const createdVehicle: z.infer<typeof VehicleSchema> = {
          stockId: data.stockId,
          title: data.title,
          make: data ? Makes.find((make) => make == data.make) || "Alfa Romeo" : "Abarth",
          model: data.model,
          variant: data.variant,
          price: data.price,
          milage: data.milage,
          year: data.year,
          color: data ? Colours.find((value) => value === data.color) || "Black" : "White",
          transmission: data ? Transmissions.find((value) => value === data.transmission) || "Manual" : "Automatic",
          fuelType: data ? FuelTypes.find((value) => value === data.fuelType) || "Electric" : "Petrol",
          extras: data.extras.map((feat, i) => ({
            id: i.toString(),
            text: feat,
          })),
          condition: data.condition,
          images: data.images,
          bodyType: data ? BodyTypes.find((value) => value === data.bodyType) || "Convertible" : "Hatchback",
          newUsed: data ? NewOrUsed.find((value) => value === data.newUsed) || "Used" : "Used",
          mmCode: data.mmCode,
        };

        // Set result (Vehicle) value to the Form's state, convert object values..
        form.reset(createdVehicle);

        // Show message
        toast.success("Your Vehicle has been Updated!", {
          description: `Redirecting you to your Vehicle.`,
        });
      },
    }
  );

  const { trigger: triggerDelete, isMutating: isMutatingDelete } = useSWRMutation(
    `/api/vehicles/${initVehicle?.stockId}/delete`,
    DeleteVehicle /* options */,
    {
      onError: () => {
        toast.error("Something unexpected happened when deleting vehicle.", {
          description: "Please try again....",
        });
      },
      onSuccess: (data) => {
        toast.success("Vehicle has been Deleted!");
      },
    }
  );

  async function submitHandler(values: z.infer<typeof VehicleSchema>) {
    console.log("Hello!");
    console.log("Submitted Form: ", values);

    if (!initVehicle) await triggerCreate({ vehicle: values });
    else await triggerUpdate({ vehicle: values });
  }

  async function deleteHandler() {
    // if (!initVehicle || !user) return;
    await triggerDelete();
    router.push("/");
  }

  return (
    <>
      {/* Add Delete loader */}
      {isMutatingCreate || isMutatingUpdate || isMutatingDelete ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <LoaderCircle className="animate-spin" size={30} />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="h-full w-full flex justify-start items-center flex-col gap-8"
          >
            {/* Head (Action Btns) */}
            <FormHead
              content={{
                createTitle: "Create vehicle",
                editTitle: "Update vehicle",
                dialogTitle: "Warning! This is can not be undone.",
                dialogDescription: "Deleting this vehicle will be a permanent action, and can not be undone.",
                liveLink: initVehicle && `https://www.dstilezauto.co.za/view-car/${initVehicle.stockId}`,
              }}
              deleteHandler={deleteHandler}
              updateHead={!!initVehicle}
            />

            {/* Form Inputs */}
            <div className="grid grid-cols-1 w-full gap-10 sm:grid-cols-2 sm:items-start lg:max-w-7xl">
              <div className="flex flex-col justify-center items-center w-full gap-5">
                {/* Meta fields */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                    <CardDescription>Easily add your Vehicle in 10 minutes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {/* Stock Id */}
                      <FormField
                        name="stockId"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock ID</FormLabel>
                            <FormControl>
                              <Input className="w-full" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Title */}
                      <FormField
                        // disabled={!!initVehicle}
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input className="w-full" type="text" placeholder="Give your Vehicle a title" {...field} />
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
                            <FormLabel>Price (Rands)</FormLabel>
                            <FormControl>
                              <Input className="w-full" type="number" {...field} />
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
                    <CardDescription>Easily add your Vehicle in 10 minutes.</CardDescription>
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
                              <Select key="make" value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Make" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  <SelectGroup>
                                    <SelectLabel>Select Make</SelectLabel>
                                    {SelectMakes.map((option) => (
                                      <SelectItem key={option.key} value={option.value}>
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
                        name="variant"
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
                              <Input className="w-full" type="number" {...field} />
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
                              <Input className="w-full" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col-reverse sm:flex-col justify-center items-center w-full gap-5">
                {/* Details fields */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                    <CardDescription>Easily add your Vehicle in 10 minutes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {/* Transmission */}
                      <FormField
                        control={form.control}
                        name="transmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transmission</FormLabel>
                            <FormControl>
                              <Select value={field.value.toString()} onValueChange={field.onChange}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Select the Transmission" />
                                </SelectTrigger>
                                <SelectContent className="">
                                  <SelectGroup>
                                    <SelectLabel>Transmission</SelectLabel>
                                    {Transmissions.map((option, i) => (
                                      <SelectItem key={i} value={option}>
                                        {option}
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
                              <Select value={field.value.toString()} onValueChange={field.onChange}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Select the Fuel type" />
                                </SelectTrigger>
                                <SelectContent className="">
                                  <SelectGroup>
                                    <SelectLabel>Fuel type</SelectLabel>
                                    {SelectFuelTypes.map((option) => (
                                      <SelectItem key={option.key} value={option.value}>
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
                              <Select value={field.value.toString()} onValueChange={field.onChange}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Select the Body type" />
                                </SelectTrigger>
                                <SelectContent className="">
                                  <SelectGroup>
                                    <SelectLabel>Make</SelectLabel>
                                    {SelectBodyTypes.map((option) => (
                                      <SelectItem key={option.key} value={option.value}>
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
                            <FormLabel>Colour</FormLabel>
                            <FormControl>
                              <Select value={field.value.toString()} onValueChange={field.onChange}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Select the Colour" />
                                </SelectTrigger>
                                <SelectContent className="">
                                  <SelectGroup>
                                    <SelectLabel>Select Colour</SelectLabel>
                                    {SelectColours.map((option) => (
                                      <SelectItem key={option.key} value={option.value}>
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
                                customTagRenderer={(tag, isActiveTag) => (
                                  <Badge
                                    key={tag.id}
                                    className="flex  px-2 py-1 justify-center items-center gap-4 border bg-slate-100 rounded-md shadow-md text-black hover:cursor-pointer"
                                  >
                                    <p className="leading-7">{tag.text}</p>
                                    <XCircle
                                      onClick={() =>
                                        setValue(
                                          "extras",
                                          form.getValues("extras").filter((t) => tag.id != t.id)
                                        )
                                      }
                                      size={18}
                                    />
                                  </Badge>
                                )}
                                variant="Primary"
                                sortTags={true}
                                includeTagsInInput={true}
                                activeTagIndex={activeExtraTagIndex}
                                setActiveTagIndex={setActiveExtraTagIndex}
                                placeholder="Enter a feature"
                                tags={field.value}
                                allowDuplicates={false}
                                className=" w-full overflow-auto "
                                styleClasses={{
                                  input: "border border-gray-300 py-5",
                                  inlineTagsContainer: "",
                                  tagPopover: {
                                    popoverContent: "bg-white shadow-lg",
                                    popoverTrigger: "text-blue-500 hover:text-blue-600",
                                  },
                                  tagList: {
                                    container: "bg-red-100",
                                    sortableList: "",
                                  },
                                  tag: {
                                    body: "flex items-center gap-2",
                                    closeButton: "text-red-500 hover:text-red-600",
                                  },
                                }}
                                setTags={(newTags) => {
                                  setValue("extras", newTags as [Tag, ...Tag[]]);
                                }}
                              />
                            </FormControl>
                            <FormDescription>(Press enter to add)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                {/* Image Input */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>Upload at least {MINFILES} image for your Vehicle.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    {/* Images */}
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage />
                          <FormControl className="px-0 sm:px-2 sm:pb-4">
                            <UploadShad
                              defaultValues={field.value}
                              handleChange={(files) => {
                                setValue("images", files); // Stores Uploaded Files
                                console.log("Formstate updated: ", form.getValues("images"));
                              }}
                            >
                              <FileInput customLoader={s3Converter} maxfiles={10} maxsize={5 * 1024 * 1024} />
                              <FilesPreview customLoader={s3Converter}>
                                <FilesPreview.Head>
                                  <h3 className="text-xl font-semibold">Uploaded files</h3>
                                  <CardDescription>
                                    {/* {uploadedImages && uploadedImages?.length > 0
              ? `You have uploaded ${uploadedImages?.length} images.`
              : `You have no images uploaded yet.`} */}
                                    You have no images uploaded yet
                                  </CardDescription>
                                </FilesPreview.Head>
                              </FilesPreview>
                            </UploadShad>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
