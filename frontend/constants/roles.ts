export const USER_ROLES = {
  FARMER: "Farmer",
  EXTENSION_WORKER: "Extension Worker",
  AGRONOMIST: "Agronomist",
  ADMIN: "Admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];