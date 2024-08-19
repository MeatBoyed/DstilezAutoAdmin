import Vehicles, { VehiclesSkeleton } from "../_comp/Vehicles";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import { searchVehicles } from "@/lib/RequestService";

export interface searchParams {
  page?: string;
  order?: string;
  pagesize?: string;
  fueltype?: string;
  make?: string;
  transmission?: string;
  bodytype?: string;
  color?: string;
}

interface PageProps {
  searchParams: searchParams;
}

// Allow user's to request property features for us to add
export default async function CreatePropertyPage({ searchParams }: PageProps) {
  return (
    <div className="w-full flex justify-start items-center gap-10 flex-col min-h-screen  ">
      <div className="w-full flex justify-between items-center flex-col gap-3">
        <SearchBar order={searchParams?.order} page={searchParams?.page} />
      </div>

      <Suspense fallback={<VehiclesSkeleton />}>
        <Vehicles searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
