import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section
      id="SignUpForm"
      className="w-full flex justify-center items-start min-h-screen  "
    >
      <SignIn />
    </section>
  );
}
