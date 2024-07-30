import { auth } from "@clerk/nextjs/server";
import FeedBackForm from "../_comp/FeedbackForm";

export default async function FeedbackPage() {
  const a = await auth();

  if (!a.userId) return null;

  return (
    <div className="w-full flex justify-start items-center gap-10 flex-col min-h-screen  ">
      <FeedBackForm userId={a.userId} />
    </div>
  );
}
