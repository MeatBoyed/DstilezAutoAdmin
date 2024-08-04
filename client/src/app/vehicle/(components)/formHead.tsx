"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, Trash2, Save, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FormHead({
  updateHead,
  content,
  deleteHandler,
}: {
  deleteHandler: () => Promise<void>;
  content: { createTitle: string; editTitle: string; dialogTitle: string; dialogDescription: string; liveLink?: string };
  updateHead: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full lg:max-w-7xl flex-wrap gap-4">
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-white hidden sm:flex"
          type="button"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {!updateHead ? content.createTitle : content.editTitle}
        </h1>
      </div>
      <div className="flex justify-center items-center gap-2">
        {/* View Live - button */}
        {updateHead && content.liveLink && (
          <Link href={content.liveLink} className={buttonVariants({ variant: "outline", className: "gap-2", size: "sm" })}>
            <EyeIcon size={16} />
            View live
          </Link>
        )}

        {/* Create / Update button */}
        <Button size="sm" type="submit" className="gap-2">
          <Save size={16} />
          {updateHead ? "Save" : "Create"}
        </Button>

        {/* Delete button */}
        {updateHead && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"} size="sm" className="gap-2">
                <Trash2 size={16} className="text-black" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{content.dialogTitle}</DialogTitle>
                <DialogDescription>{content.dialogDescription}</DialogDescription>
              </DialogHeader>
              <DialogFooter
                style={{ justifyContent: "space-between" }}
                className="flex p-0 m-0 justify-between items-center w-full"
              >
                <p className="text-sm font-normal ">Are you sure you want to do this?</p>
                <Button variant={"destructive"} type="button" onClick={async () => await deleteHandler()}>
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
