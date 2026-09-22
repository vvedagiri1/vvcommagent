export function validateCustomerPayload(value) {
  const requiredFields = ["email", "firstname", "lastname"];
  const missingFields = requiredFields.filter((field) => !isPresent(value?.[field]));
  return missingFields;
}

function isPresent(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}
