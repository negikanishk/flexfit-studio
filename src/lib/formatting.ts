export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatCreditCount(credits: number): string {
  return `${credits} ${credits === 1 ? "credit" : "credits"}`;
}

export function getRoleBadgeVariant(role: string): "default" | "success" | "warning" | "danger" | "info" {
  switch (role) {
    case "admin":
      return "danger";
    case "front_desk":
      return "info";
    case "trainer":
      return "warning";
    default:
      return "success";
  }
}

export function getBookingStatusVariant(status: string): "default" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "confirmed":
      return "info";
    case "attended":
      return "success";
    case "cancelled":
      return "danger";
    case "no_show":
      return "warning";
    default:
      return "default";
  }
}
