import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Vehicles from "./_comp/Vehicles";
import Link from "next/link";

// Allow user's to request property features for us to add
export default async function CreatePropertyPage() {
  return (
    <div className="w-full flex justify-start items-center gap-10  pb-20  my-5 flex-col px-3 sm:px-5 min-h-screen  ">
      <div className="flex w-full justify-between items-center sm:px-5 lg:max-w-7xl ">
        <p className="scroll-m-20 text- sm:text-lg font-semibold tracking-tight">
          Your Properties
        </p>
        <Link
          href="/create"
          className={buttonVariants({
            className: "gap-2",
            size: "sm",
          })}
        >
          <PlusCircle size={16} />
          <p>Add Vehicle</p>
        </Link>
      </div>

      <div className="w-full sm:px-5 lg:max-w-7xl ">
        <Vehicles />
      </div>
    </div>
  );
}
