export function canAccessAdmin(role: string): boolean {
  return role === "Admin";
}

export function canExportReports(role: string): boolean {
  return true;
}