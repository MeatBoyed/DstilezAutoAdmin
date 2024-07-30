import { cn } from "@/lib/utils";
import { BedDouble, Bath, Calendar, Car, Gauge, Link } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { AspectRatio } from "../../components/ui/aspect-ratio";

export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className="border-0  md:min-w-fit min-w-max bg-transparent">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl  hover:cursor-pointer",
          className
        )}
      >
        <AspectRatio ratio={3 / 2}>
          <Skeleton className="min-w-full min-h-full " />
        </AspectRatio>
        <Skeleton className="min-w-full h-32 " />
      </div>
      <CardContent className="px-1 flex flex-col gap-3 pt-4">
        <div className="flex gap-3 justify-start items-center overflow-hidden">
          <Skeleton className="min-w-full h-5  " />
        </div>

        <Skeleton className="min-w-full h-5  " />
        <Skeleton className="min-w-full h-5  " />
      </CardContent>
    </Card>
  );
}
