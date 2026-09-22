export default {
  metadata: {
    id: "customer-event-logger",
    displayName: "Customer Event Logger",
    description: "Processes Adobe Commerce customer_save_commit_after events, validates required fields, and logs processed customer details.",
    version: "1.0.0",
  },
  eventing: {
    commerce: [
      {
        provider: {
          label: "Commerce Events Provider",
          description: "Delivers Adobe Commerce customer events to App Builder runtime actions.",
        },
        events: [
          {
            name: "observer.customer_save_commit_after",
            label: "Customer Save Commit After",
            description: "Triggered after a customer record is committed in Adobe Commerce.",
            fields: [
              { name: "id" },
              { name: "email" },
              { name: "firstname" },
              { name: "lastname" },
            ],
            runtimeActions: ["my-app/process-customer-event"],
          },
        ],
      },
    ],
  },
};
