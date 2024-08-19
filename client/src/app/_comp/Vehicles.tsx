import { VehicleCardSkeleton } from "@/app/_comp/VehicleCardSkeleton";
import { PaginationController } from "./PaginationController";
import { VehicleCard } from "./VehicleCard";
import { searchParams } from "../(Core)/page";
import { searchVehicles } from "@/lib/RequestService";

export default async function Vehicles({ searchParams }: { searchParams: searchParams }) {
  const data = await searchVehicles(searchParams);
  if (!data)
    return (
      <div className="flex flex-col justify-center items-center gap-5">
        <h1>Ooops 🫤 Looks like no vehicles match your search. Please try again.</h1>
      </div>
    );

  return (
    <div className="flex justify-center items-center flex-col gap-5 w-full">
      <div className="w-full grid auto-rows-max gap-4">
        {/* <SearchBar /> */}
        <div className="flex justify-start items-center gap-3 max-w-xs">
          <p className="text-sm font-medium leading-none">Search Results: {data.totalCount}</p>
          {/* <VehiclesPerPage searchParams={searchParams} /> */}
        </div>
        {data.totalCount < 1 && (
          <div className="flex justify-center items-center w-full min-h-40">
            <p>Oops! Looks like there are no vehicles available. Changing it up, and trying again.</p>
          </div>
        )}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {data.items.map((vehicle) => (
            <VehicleCard vehicle={vehicle} key={vehicle.stockId} />
          ))}
        </div>
        <PaginationController
          totalPages={data.totalPages}
          searchParams={searchParams}
          currentPage={searchParams.page ? parseInt(searchParams.page) : 1}
        />
      </div>
    </div>
  );
}

export function VehiclesSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
      <VehicleCardSkeleton />
      <VehicleCardSkeleton />
      <VehicleCardSkeleton />
    </div>
  );
}

// function VehiclesPerPage({ searchParams: { order, page, pagesize } }: { searchParams: searchParams }) {
//   const router = useRouter();
//   return (
//     <Select
//       defaultValue={OrderByEnum.safeParse(order).success ? order : "price-desc"}
//       onValueChange={(value) => {
//         const url = new URLSearchParams({ page: page || "1", order: order || "price-desc", pagesize: value });
//         router.push(`/?${url.toString()}`);
//       }}
//     >
//       <SelectTrigger className="min-w-max">
//         <SelectValue defaultValue={"price-desc"} placeholder="Sort by" className="focus:ring-0" />
//       </SelectTrigger>
//       <SelectContent className="w-full" align="end">
//         <SelectItem value="5">5</SelectItem>
//         <SelectItem value="10">10</SelectItem>
//         <SelectItem value="15">15</SelectItem>
//         <SelectItem value="20">20</SelectItem>
//       </SelectContent>
//     </Select>
//   );
// }
