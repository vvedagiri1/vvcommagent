import { validateCustomerPayload } from "./validator.js";
import { buildProcessedCustomer } from "./transformer.js";

export async function main(params) {
  const operation = "process-customer-event";

  try {
    const value = params?.data?.value;
    const customerId = value?.id;
    const missingFields = validateCustomerPayload(value);

    if (missingFields.length > 0) {
      console.log("Commerce customer event received");
      console.log(`Customer ID: ${customerId ?? "unknown"}`);
      console.log(`Missing Fields: ${missingFields.join(", ")}`);
      console.log("Processed: false");

      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: {
          processed: false,
          missingFields,
        },
      };
    }

    const processedCustomer = buildProcessedCustomer(value);

    console.log("Commerce customer event received");
    console.log(`Customer ID: ${processedCustomer.customerId}`);
    console.log(`Full Name: ${processedCustomer.fullName}`);
    console.log(`Email: ${processedCustomer.email}`);
    console.log(`Customer Type: ${processedCustomer.customerType}`);
    console.log(`Processed: ${processedCustomer.processed}`);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: processedCustomer,
    };
  } catch (error) {
    console.error("Unexpected error while processing customer event", {
      operation,
      customerId: params?.data?.value?.id,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: {
        processed: false,
        error: "Unexpected error while processing customer event",
      },
    };
  }
}
