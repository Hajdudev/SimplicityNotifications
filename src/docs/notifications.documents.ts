import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { notificationPostRequestSchema, notificationPutRequestSchema, notificationsGetRequestSchema } from "../types/request/notifications.request.schema";
import z from "zod";
import { notificationsResponseSchema } from "../types/response/notifications.response.schema";
import { idParamsSchema } from "../types/request/common.request.schema";

export function registerNotificationsEndpoints(registry: OpenAPIRegistry) {
  registry.register("Notification", notificationsResponseSchema);

  // GET /notifications - List all notifications
  registry.registerPath({
    method: "get",
    path: "/notifications",
    summary: "List all notifications",
    tags: ["Notifications"],
    request: {
      query: notificationsGetRequestSchema,
    },
    responses: {
      200: {
        description: "Notifications successfully retrieved",
        content: {
          "application/json": {
            schema: z.array(notificationsResponseSchema),
          },
        },
      },
    },
  });

  // GET /notifications/:id - Get a notification by ID
  registry.registerPath({
    method: "get",
    path: "/notifications/{id}",
    summary: "Get a notification by ID",
    tags: ["Notifications"],
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Notification successfully retrieved",
        content: {
          "application/json": {
            schema: notificationsResponseSchema,
          },
        },
      },
      404: {
        description: "Notification not found",
      },
    },
  });

  // POST /notifications - Create a notification
  registry.registerPath({
    method: "post",
    path: "/notifications",
    summary: "Create a notification",
    tags: ["Notifications"],
    security: [{ Bearer: [] }],
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: notificationPostRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Notification created successfully",
        content: {
          "application/json": {
            schema: notificationsResponseSchema,
          },
        },
      },
    },
  });

  // PUT /notifications/:id - Update a notification by ID
  registry.registerPath({
    method: "put",
    path: "/notifications/{id}",
    summary: "Update a notification by ID",
    tags: ["Notifications"],
    security: [{ Bearer: [] }],
    request: {
      params: idParamsSchema,
      body: {
        required: true,
        content: {
          "application/json": {
            schema: notificationPutRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Notification updated successfully",
        content: {
          "application/json": {
            schema: notificationsResponseSchema,
          },
        },
      },
      404: {
        description: "Notification not found",
      },
    },
  });

  // DELETE /notifications/:id - Delete a notification by ID
  registry.registerPath({
    method: "delete",
    path: "/notifications/{id}",
    summary: "Delete a notification by ID",
    tags: ["Notifications"],
    security: [{ Bearer: [] }],
    request: {
      params: idParamsSchema,
    },
    responses: {
      204: {
        description: "Notification deleted successfully"
      },
      404: {
        description: "Notification not found"
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/ws/notifications",
    summary: "WebSocket connection for real-time notifications",
    description: `
      Connect to this WebSocket endpoint to receive real-time notifications when new notifications are created.
      
      **Connection URL:** \`ws://localhost:3000/ws/notifications\`
      
      **Message Format:**
      \`\`\`json
      {
        "type": "NEW_NOTIFICATION",
        "data": {
          "id": 42,
          "title": "Emergency Alert",
          "content": "Road closure on Main Street",
          "category": "emergencies",
          "created": 1753749030986,
          "updated": 1753749030986
        }
      }
      \`\`\`
    `,
    tags: ["Notifications", "WebSocket"],
    responses: {
      101: {
        description: "Switching Protocols - WebSocket connection established",
      },
      404: {
        description: "WebSocket endpoint not found",
      },
    },
  });
}
