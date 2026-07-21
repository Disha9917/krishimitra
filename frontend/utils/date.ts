export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getRelativeDays(daysOffset: number): string {
  const target = new Date();
  target.setDate(target.getDate() + daysOffset);
  return formatDate(target);
}

export function getDayName(daysOffset: number): string {
  const target = new Date();
  target.setDate(target.getDate() + daysOffset);
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(target);
}