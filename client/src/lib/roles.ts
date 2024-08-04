import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();

  console.log("User role: ", sessionClaims?.metadata);

  if (sessionClaims?.metadata.role === undefined) return false;

  return sessionClaims?.metadata.role === role;
};
