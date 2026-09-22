export function buildProcessedCustomer(value) {
  const firstname = String(value.firstname ?? "").trim();
  const lastname = String(value.lastname ?? "").trim();
  const fullName = [firstname, lastname].filter(Boolean).join(" ");

  return {
    customerId: value.id,
    fullName,
    email: value.email,
    customerType: "new-commerce-customer",
    processed: true,
  };
}
