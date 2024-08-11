"use client";

import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";
import Vehicles, { VehiclesSkeleton } from "../../_comp/Vehicles";
import LeadTable, { fetchVehicles } from "./_components/leadTable";
import { LeadPaginationResponse } from "@/server/util/BusinessLogic";
import useSWR from "swr";

export interface leadSearchParams {
  page?: string;
  pagesize?: string;
  order?: string;
  stockid: string;
  status?: string;
  willtrade?: string;
  requireFinance?: string;
  requireRentToOwn?: string;
  enquiryDate?: string;
}

interface PageProps {
  searchParams: leadSearchParams;
}

export default function LeadPage({ searchParams }: PageProps) {
  console.log("Search Params: ", searchParams);

  const { data, error, isLoading } = useSWR<LeadPaginationResponse>(
    `/api/leads/?page=${searchParams.page || 1}${searchParams.order && `&order=${searchParams.order}`}${
      searchParams.status && `&status=${searchParams.status}`
    }${searchParams.stockid && `&stockid=${searchParams.stockid}`}${
      searchParams.requireFinance && `&requireFinance=${searchParams.requireFinance}`
    }${searchParams.requireRentToOwn && `&requireRentToOwn=${searchParams.requireRentToOwn}`}${
      searchParams.willtrade && `&willtrade=${searchParams.willtrade}`
    }
    }${searchParams.enquiryDate && `&enquiryDate=${searchParams.enquiryDate}`}`,
    fetchVehicles
  );

  console.log("Data: ", data);

  return (
    <Suspense fallback={<VehiclesSkeleton />}>
      <div className="w-full flex mb-10 justify-start items-center gap-10 flex-col min-h-screen  ">
        {data && <LeadTable data={data} searchParams={searchParams} />}
      </div>
    </Suspense>
  );
}
