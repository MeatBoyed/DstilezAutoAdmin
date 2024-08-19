import VehicleForm from "../(components)/VehicleForm";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { env } from "../../../../../env";
import { getData } from "@/lib/RequestService";

// (default): Dynamic segments not included in generateStaticParams are generated on demand.
export const dynamicParams = true;

// // Render all paths at build time
// export async function generateStaticParams() {
//   const vehicles = (await fetch(`${env.NEXT_PUBLIC_HOST_URL}/api/vehicles/params`).then((res) => res.json())) as {
//     stockId: number;
//   }[];

//   return vehicles.map((vehicle) => ({
//     slug: vehicle.stockId,
//   }));
// }

// Allow user's to request property features for us to add
export default async function Page({ params }: { params: { stockid: string } }) {
  const data = await getData(params.stockid);

  if (!data)
    return (
      <div className="flex flex-col justify-center items-center gap-5">
        <h1>Ooops 🫤 It looks like this vehicle doesn&#39;t exist</h1>
        <div className="flex justify-center items-center gap-4">
          <Link href={"/"} prefetch={true} className={buttonVariants()}>
            Search Vehicles
          </Link>
        </div>
      </div>
    );

  return (
    <Suspense fallback={<Loader />}>
      <section id="createpropertyform" className="">
        <div className="mx-auto grid lg:max-w-8xl flex-1 w-full auto-rows-max gap-4">
          <VehicleForm initVehicle={data} />
        </div>
      </section>
    </Suspense>
  );
}
