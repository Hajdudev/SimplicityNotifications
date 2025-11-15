import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerNotificationsEndpoints } from "./notifications.documents";

export const registry = new OpenAPIRegistry();

registerNotificationsEndpoints(registry);

const generator = new OpenApiGeneratorV31(registry.definitions);
export const openApiDocument = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "simplicityNotifications",
    version: "3.1.0",
    description: "API documentation generated from Zod schemas.",
  },
});
