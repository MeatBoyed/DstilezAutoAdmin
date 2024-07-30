import { honoRPCClient } from "@/app/api/[[...route]]/route";
import { notFound } from "next/navigation";
import VehicleForm from "../(components)/VehicleForm";
import { Suspense } from "react";
import Loader from "@/components/Loader";

async function fetchVehicle(stockid: string) {
  const res = await honoRPCClient.vehicles[":stockid"].$get({
    param: {
      stockid: stockid,
    },
  });

  if (res.ok) return await res.json();
}

// Allow user's to request property features for us to add
export default async function Page({ params }: { params?: { stockid?: string } }) {
  if (params?.stockid === undefined) return notFound;

  const vehicle = await fetchVehicle(params?.stockid);

  if (!vehicle) return notFound();

  return (
    <Suspense fallback={<Loader />}>
      <section id="createpropertyform" className="">
        <div className="mx-auto grid lg:max-w-8xl flex-1 w-full auto-rows-max gap-4">
          {/* <VehicleForm initVehicle={vehicle} /> */}
        </div>
      </section>
    </Suspense>
  );
}
