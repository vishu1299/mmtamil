export const registrationKeys = {
  all: ["registration"] as const,
  user: () => [...registrationKeys.all, "user"] as const,
};
