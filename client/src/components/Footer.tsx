import Link from "next/link";
import { MainNavlinks } from "./Navbar";

export default function Footer() {
  return (
    <footer className="pt-10 pb-5 w-full bg-black text-white z-50 shadow-sm flex justify-center items-center ">
      <div className="px-4 w-full flex justify-center items-center  flex-col gap-8 sm:max-w-3xl lg:max-w-5xl xl:px-0">
        <div className="w-full justify-between flex items-center flex-wrap ">
          {/* logo */}
          <Link href="/" className="transition scroll-m-20 text-xl font-semibold tracking-tight">
            Dstilez Auto - AP
          </Link>

          <div className="flex justify-start items-center gap-8 ">
            {/* NavLinks for larger screens */}
            <div className="hidden md:flex w-full justify-center ">
              <MainNavlinks className="text-white " />
            </div>

            {/* User button and signup */}
            <div className="flex items-center gap-4">{/* <UserButton /> */}</div>

            {/* NavSlider for smaller screens */}
            {/* <div className="md:hidden">
            <MainNavSlider />
          </div> */}
          </div>
        </div>
        <div className="w-full border" />
        <div className="w-full flex justify-center items-center flex-col gap-10">
          <div className="flex justify-center items-center flex-col">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Powered by</h3>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-[#00AAFF] ">Nerf Designs</h2>
            <div className="leading-7">Nerf your competition</div>
          </div>

          <p className="leading-7 text-center">Copyright © {new Date().getFullYear()} Nerf Designs. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
