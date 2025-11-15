import dotenv from "dotenv";

const dotEnvFile =
  process.env.ENVIRONMENT === "prod" ? ".env.prod" : process.env.ENVIRONMENT === "dev" ? ".env.dev" : ".env.local";
dotenv.config({ path: dotEnvFile });

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { queryParser } from "express-query-parser";
import { router } from "./router";
import rateLimit from "express-rate-limit";
import { LoggerService } from "./utils/LoggerService";
import { getPort } from "./utils/utils";
import { errorHandler } from "./controller/error.controller";
import { initializeWebSocket } from "./services/websocket.service";
import { createServer } from "http";

const app: Express = express();
const port = getPort();
const logger = new LoggerService();

/* Allows:
http://localhost:{any port} */
const allowedOriginRegex = /^https:\/\/(feature-.{1,40}\.|dev\.|www\.)?domain\.name$|^http:\/\/localhost:\d{1,5}$/i;
app.use(
  cors({
    origin: allowedOriginRegex,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// use helmet predefined headers to increase app security (cross-site scripting, prevent app running in iframe)
app.use(
  helmet({
    crossOriginResourcePolicy: false, // default is same-origin
  })
);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies

// parse query parameters from string to their respective types
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // per IP
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// api limiter
app.use("/", apiLimiter);

// routes
app.use("/", router);

// error handler
app.use(errorHandler);

const server = createServer(app);

initializeWebSocket(server);

server.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
