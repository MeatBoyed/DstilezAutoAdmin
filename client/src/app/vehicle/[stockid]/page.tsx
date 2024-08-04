"use client";

import VehicleForm from "../(components)/VehicleForm";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { Vehicle } from "@prisma/client";
import useSWR from "swr";
import { notFound, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Allow user's to request property features for us to add
export default function Page({ params }: { params?: { stockid?: string } }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<Vehicle>(`/api/vehicles/${params?.stockid}`, fetcher);

  if (isLoading === false && error)
    return (
      <div className="flex flex-col justify-center items-center gap-5">
        <h1>Ooops 🫤 It looks like this vehicle doesn&#39;t exist</h1>
        <div className="flex justify-center items-center gap-4">
          <Button variant={"outline"} onClick={() => router.back()}>
            Go back
          </Button>
          <Link href={"/"} prefetch={true} className={buttonVariants()}>
            Search Vehicles
          </Link>
        </div>
      </div>
    );
  return (
    <Suspense fallback={<Loader />}>
      <section id="createpropertyform" className="">
        {isLoading && !error && <Loader />}
        {data && !error && !isLoading && (
          <div className="mx-auto grid lg:max-w-8xl flex-1 w-full auto-rows-max gap-4">
            <VehicleForm initVehicle={data} />
          </div>
        )}
      </section>
    </Suspense>
  );
}
