import React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  // const { userId } = auth();

  return (
    <nav className=" w-full bg-white z-50 flex justify-center items-center border-b shadow-sm">
      <div className="py-4 justify-between flex items-center flex-wrap px-4 w-full sm:max-w-3xl lg:max-w-5xl xl:px-0">
        {/* logo */}
        <Link
          href="/"
          className="transition scroll-m-20 text-xl font-semibold tracking-tight"
        >
          Dstilez Auto - Admin
        </Link>

        <div className="flex justify-start items-center gap-8 ">
          {/* NavLinks for larger screens */}
          <div className="hidden md:flex w-full justify-center">
            <MainNavlinks />
          </div>

          {/* User button and signup */}
          <div className="flex items-center gap-4">
            <UserButton />
          </div>

          {/* NavSlider for smaller screens */}
          <div className="md:hidden">
            <MainNavSlider />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MainNavSlider() {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon size={25} />
      </SheetTrigger>
      <SheetContent className="flex justify-between py-80 items-start flex-col shadow-lg">
        <Link href="/property-for-sale">
          <p className="text-xl">Dstilez Auto</p>
        </Link>
        <Link href="/feedback">
          <p className="text-xl">Feedback</p>
        </Link>
      </SheetContent>
    </Sheet>
  );
}

export function MainNavlinks({ className }: { className?: string }) {
  return (
    <div className="flex justify-center gap-8 items-center">
      <Link href="/">
        <p
          className={cn(
            "text-base text-black hover:text-gray-700 transition",
            className
          )}
        >
          Home
        </p>
      </Link>
      <Link href="https://www.dstilezauto.co.za/">
        <p
          className={cn(
            "text-base text-black hover:text-gray-700 transition",
            className
          )}
        >
          Dstilez Auto
        </p>
      </Link>
      <Link href="/feedback">
        <p
          className={cn(
            "text-base text-black hover:text-gray-700 transition",
            className
          )}
        >
          Feedback
        </p>
      </Link>
    </div>
  );
}
