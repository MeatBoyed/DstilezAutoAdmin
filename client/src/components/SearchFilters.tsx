"use client";
import {
  BodyTypes,
  Colours,
  FilterBodyTypes,
  FilterColours,
  FilterFuelTypes,
  FilterMakes,
  FilterSelectBodyTypes,
  FilterSelectColours,
  FilterSelectFuelTypes,
  FilterSelectMakes,
  FilterSelectTransmissions,
  FilterTransmissions,
  FuelTypes,
  Makes,
  SelectBodyTypes,
  SelectColours,
  SelectFuelTypes,
  SelectMakes,
  SelectTransmissions,
  Transmissions,
} from "@/lib/formData";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { SelectGroup } from "@radix-ui/react-select";

export const SearchQueryParameterSchema = z.object({
  fuelType: z
    .enum(FilterFuelTypes, { invalid_type_error: "Invalid fuel type selected. Please choose a valid fuel type." })
    .optional(),
  make: z.enum(FilterMakes, { invalid_type_error: "Invalid make selected. Please choose a valid make." }).optional(),
  transmission: z
    .enum(FilterTransmissions, {
      invalid_type_error: "Invalid transmission type selected. Please choose a valid transmission type.",
    })
    .optional(),
  bodyType: z
    .enum(FilterBodyTypes, {
      invalid_type_error: "Invalid body type selected. Please choose a valid body type.",
    })
    .optional(),
  colour: z
    .enum(FilterColours, {
      invalid_type_error: "Invalid colour selected. Please choose a valid colour.",
    })
    .optional(),
});

export function SearchFilters({ onSubmit }: { onSubmit: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof SearchQueryParameterSchema>>({
    resolver: zodResolver(SearchQueryParameterSchema),
    defaultValues: {
      fuelType: z.enum(FilterFuelTypes).safeParse(searchParams.get("fueltype")).data || undefined,
      make: z.enum(FilterMakes).safeParse(searchParams.get("make")).data || undefined,
      transmission: z.enum(FilterTransmissions).safeParse(searchParams.get("transmission")).data || undefined,
      bodyType: z.enum(FilterBodyTypes).safeParse(searchParams.get("bodytype")).data || undefined,
      colour: z.enum(FilterColours).safeParse(searchParams.get("colour")).data || undefined,
    },
  });
  const { setValue } = form;

  function submitHandler(values: z.infer<typeof SearchQueryParameterSchema>) {
    console.log("Submitted Form: ", values);
    const params = new URLSearchParams(searchParams);

    // Reset Params
    params.delete("fueltype");
    params.delete("make");
    params.delete("transmission");
    params.delete("bodytype");
    params.delete("color");

    // // Set new values
    if (values.fuelType && values.fuelType !== "Select fuel type") params.set("fueltype", values.fuelType);
    if (values.make && values.make !== "Select makes") params.set("make", values.make);
    if (values.transmission && values.transmission !== "Select transmission") params.set("transmission", values.transmission);
    if (values.bodyType && values.bodyType !== "Select body types") params.set("bodytype", values.bodyType);
    if (values.colour && values.colour !== "Select colours") params.set("color", values.colour);

    console.log("Created Params: ", params.toString());
    router.push(`${pathname}?${params.toString()}`);
    onSubmit();
  }

  return (
    <div className="flex justify-center items-center w-full">
      {/* Filter options */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="w-full h-full flex flex-col justify-center items-center gap-6"
        >
          <div className="flex flex-col justify-center items-start flex-wrap text-black w-full gap-4">
            {/* Fuel Type */}
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Choose the Fuel Type</FormLabel>

                  <FormControl>
                    <Select value={field.value?.toString()} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {FilterSelectFuelTypes.map((option) => (
                          <SelectItem key={option.key} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Make */}
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Choose the Make</FormLabel>
                  <FormControl>
                    <Select value={field.value?.toString()} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {FilterSelectMakes.map((option) => (
                          <SelectItem key={option.key} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transmission */}
            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Choose the Transmission</FormLabel>
                  <FormControl>
                    <Select value={field.value?.toString()} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {FilterSelectTransmissions.map((option) => (
                          <SelectItem key={option.key} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BodyType */}
            <FormField
              control={form.control}
              name="bodyType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Choose the Body Types</FormLabel>
                  <FormControl>
                    <Select value={field.value?.toString()} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {FilterSelectBodyTypes.map((option) => (
                          <SelectItem key={option.key} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
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
              name="colour"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Choose the Colour</FormLabel>
                  <FormControl>
                    <Select value={field.value?.toString()} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select colour" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {FilterSelectColours.map((option) => (
                          <SelectItem key={option.key} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex space-x-3">
            <Button
              type="button"
              onClick={() => {
                setValue("bodyType", "Select body types");
                setValue("colour", "Select colours");
                setValue("fuelType", "Select fuel type");
                setValue("make", "Select makes");
                setValue("transmission", "Select transmission");
              }}
              variant={"outline"}
            >
              Reset
            </Button>
            <Button type="submit">Apply filter</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
