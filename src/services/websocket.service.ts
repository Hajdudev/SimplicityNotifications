import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { SelectableNotifications } from "../dao/notifications.dao";
import { LoggerService } from "../utils/LoggerService";

const logger = new LoggerService();

let wss: WebSocketServer | null = null;

export function initializeWebSocket(server: HTTPServer) {
  wss = new WebSocketServer({ server, path: "/ws/notifications" });

  wss.on("connection", (ws: WebSocket) => {
    logger.info("New WebSocket client connected");

    ws.on("close", () => {
      logger.info("WebSocket client disconnected");
    });

    ws.on("error", (error: Error) => {
      logger.error("WebSocket error:", error);
    });
  });

  logger.info("WebSocket server initialized on /ws/notifications");
}

export function broadcastNewNotification(notification: SelectableNotifications) {
  if (!wss) {
    logger.warn("WebSocket server not initialized");
    return;
  }

  const message = JSON.stringify({
    type: "NEW_NOTIFICATION",
    data: notification,
  });

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  logger.info(`Broadcasted new notification: ${notification.id}`);
}
