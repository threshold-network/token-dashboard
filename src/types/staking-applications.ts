export type AuthorizationStatus =
  | "authorization-not-required"
  | "to-authorize"
  | "authorized"
  | "pending-deauthorization"
  | "deauthorization-initiation-needed"
