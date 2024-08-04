export {};

// Create a type for the roles
export type Roles = "admin" | "viewer";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
