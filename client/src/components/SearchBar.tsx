"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, SearchIcon, SlidersIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter } from "next/navigation";
import { OrderByEnum } from "@/server/util/BusinessLogic";
import { SelectMakes } from "@/lib/formData";
import { searchParams } from "@/app/(Core)/page";
import { SearchFilters } from "./SearchFilters";
import { useState } from "react";
interface Searchprops {
  page?: string;
  order?: string;
}
export default function Component(props: Searchprops) {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-3 sm:flex-row">
      <FilterDialog />
      <SortBy order={props.order} page={props.page} />
      <Link href="/vehicle/create" className={buttonVariants({ className: "gap-2 w-full", variant: "outline" })}>
        <PlusCircle size={16} />
        <p>Add Vehicle</p>
      </Link>
    </div>
  );
}

function FilterDialog() {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
      <DialogTrigger className="flex gap-3 w-full">
        <Button className="relative px-4 py-2  focus:ring-0 w-full">
          <SearchIcon size={24} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
          Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <SearchFilters onSubmit={() => setFilterOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SortBy({ page, order }: Searchprops) {
  const router = useRouter();
  return (
    <Select
      defaultValue={OrderByEnum.safeParse(order).success ? order : "price-desc"}
      onValueChange={(value) => {
        const url = new URLSearchParams({ page: page || "1", order: value });
        router.push(`/?${url.toString()}`);
      }}
    >
      <SelectTrigger className="min-w-max">
        <SelectValue defaultValue={"price-desc"} placeholder="Sort by" className="focus:ring-0" />
      </SelectTrigger>
      <SelectContent className="w-full" align="end">
        <SelectItem value="title-asc">Ascending</SelectItem>
        <SelectItem value="title-desc">Descending</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="year-asc">Year: Low to High</SelectItem>
        <SelectItem value="year-desc">Year: High to Low</SelectItem>
        <SelectItem value="milage-asc">Milage: Low to High</SelectItem>
        <SelectItem value="milage-desc">Milage: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
}
