import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";
import Vehicles, { VehiclesSkeleton } from "../../_comp/Vehicles";
import LeadTable from "./_components/leadTable";

export interface leadSearchParams {
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
  searchParams: leadSearchParams;
}

export default function LeadPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<VehiclesSkeleton />}>
      <div className="w-full flex mb-10 justify-start items-center gap-10 flex-col min-h-screen  ">
        <LeadTable privacyMode />
      </div>
    </Suspense>
  );
}
