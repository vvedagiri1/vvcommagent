import assert from "node:assert/strict";
import test from "node:test";
import { main } from "./index.js";
import { validateCustomerPayload } from "./validator.js";
import { buildProcessedCustomer } from "./transformer.js";

test("validateCustomerPayload returns missing fields", () => {
  assert.deepEqual(validateCustomerPayload({ email: "john.doe@example.com" }), ["firstname", "lastname"]);
});

test("buildProcessedCustomer creates the required shape", () => {
  assert.deepEqual(
    buildProcessedCustomer({ id: 100245, email: "john.doe@example.com", firstname: "John", lastname: "Doe" }),
    {
      customerId: 100245,
      fullName: "John Doe",
      email: "john.doe@example.com",
      customerType: "new-commerce-customer",
      processed: true,
    },
  );
});

test("main logs and returns the processed customer", async () => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args.join(" "));
  console.error = (...args) => logs.push(args.join(" "));

  try {
    const result = await main({
      data: {
        value: {
          id: 100245,
          email: "john.doe@example.com",
          firstname: "John",
          lastname: "Doe",
        },
      },
    });

    assert.equal(result.statusCode, 200);
    assert.deepEqual(result.body, {
      customerId: 100245,
      fullName: "John Doe",
      email: "john.doe@example.com",
      customerType: "new-commerce-customer",
      processed: true,
    });
    assert.deepEqual(logs, [
      "Commerce customer event received",
      "Customer ID: 100245",
      "Full Name: John Doe",
      "Email: john.doe@example.com",
      "Customer Type: new-commerce-customer",
      "Processed: true",
    ]);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
});

test("main handles missing fields without throwing", async () => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args.join(" "));
  console.error = (...args) => logs.push(args.join(" "));

  try {
    const result = await main({
      data: {
        value: {
          id: 100245,
          email: "john.doe@example.com",
        },
      },
    });

    assert.equal(result.statusCode, 400);
    assert.deepEqual(result.body, {
      processed: false,
      missingFields: ["firstname", "lastname"],
    });
    assert.deepEqual(logs, [
      "Commerce customer event received",
      "Customer ID: 100245",
      "Missing Fields: firstname, lastname",
      "Processed: false",
    ]);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
});
