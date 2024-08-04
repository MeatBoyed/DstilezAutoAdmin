import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div className="flex justify-center items-center flex-col gap-5">
        <div className="flex justify-center items-center flex-col gap-2">
          <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">Ooops 🫤</h2>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            Your account doesn&apos;t have access to Dstilez Auto Admin Panel.
          </h1>
        </div>
        <div className="text-lg font-semibold">If you should have access, contact the appropriate person at Dstilez Auto.</div>
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        <Link href={"https://www.dstilezauto.co.za/"} className={buttonVariants()}>
          Back to Dstilez Auto
        </Link>
        <Link href={"https://www.nerfdesigns.com/"} className="text-lg text-muted-foreground">
          Dstilez Auto is Secured by Nerf Designs
        </Link>
      </div>
    </div>
  );
}
