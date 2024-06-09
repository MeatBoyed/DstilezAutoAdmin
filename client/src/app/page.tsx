"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navbar from "./_comp/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Navbar />
          <div className="grid flex-1 auto-rows-max gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {/* Heading */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Edit Vehicle
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                In stock
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm">Save Product</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                {/* Core Details */}
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label>Stock ID</Label>
                        <Input
                          id="stockId"
                          type="text"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Title</Label>
                        <Input
                          id="title"
                          type="text"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Make</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Make" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Make</SelectLabel>
                              <SelectItem value="apple">Audi</SelectItem>
                              <SelectItem value="banana">Bently</SelectItem>
                              <SelectItem value="blueberry">BMW</SelectItem>
                              <SelectItem value="grapes">Brabus</SelectItem>
                              <SelectItem value="pineapple">Maybach</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Model</Label>
                        <Input
                          id="model"
                          type="text"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Variant</Label>
                        <Input
                          id="variant"
                          type="text"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Image Upload */}
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>
                      Drag and drop your images here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h1>DnD</h1>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {/* Essential Detilas */}
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label>Price</Label>
                        <Input
                          id="price"
                          type="number"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Year</Label>
                        <Input
                          id="variant"
                          type="number"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Milage</Label>
                        <Input
                          id="variant"
                          type="number"
                          className="w-full"
                          defaultValue="1023"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Externam Details */}
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Minor Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label>Colour</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Colour" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Colour</SelectLabel>
                              <SelectItem value="apple">Audi</SelectItem>
                              <SelectItem value="banana">Bently</SelectItem>
                              <SelectItem value="blueberry">BMW</SelectItem>
                              <SelectItem value="grapes">Brabus</SelectItem>
                              <SelectItem value="pineapple">Maybach</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Transmission</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Transmission</SelectLabel>
                              <SelectItem value="apple">Manual</SelectItem>
                              <SelectItem value="banana">Automatic</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Fuel Type</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Fuel Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Fuel Type</SelectLabel>
                              <SelectItem value="apple">Petrol</SelectItem>
                              <SelectItem value="banana">Disel</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Body Type</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Body Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Body Type</SelectLabel>
                              <SelectItem value="apple">Hatchback</SelectItem>
                              <SelectItem value="banana">Coupe</SelectItem>
                              <SelectItem value="blueberry">SUV</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
