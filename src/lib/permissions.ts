export type Role = "admin" | "front_desk" | "trainer" | "member";

export function canManageMembers(role: Role): boolean {
  return role === "admin" || role === "front_desk";
}

export function canCheckIn(role: Role): boolean {
  return role === "admin" || role === "front_desk";
}

export function canManageClasses(role: Role): boolean {
  return role === "admin" || role === "trainer";
}

export function canManageCorporatePools(role: Role): boolean {
  return role === "admin";
}

export function canViewRevenueReports(role: Role): boolean {
  return role === "admin";
}
