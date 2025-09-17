import "./utils/jsonSerializer";
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import { httpRouter } from "./router";
import { errorHandler } from "./middlewares/errorHandler";
import { checkDbConnection } from "./db/db";

dotenv.config();

export const app = express();

app.use(express.json());
// middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], credentials: true }));

// routes
app.use("/api", httpRouter);

// error handling middlware
app.use(errorHandler);

// ws middleware
// ws.use(verifyJwtForWs)

//ws routes
// wsRouter("/ws");

const port = process.env.PORT ? process.env.PORT : 8000;

const startServer = async () => {
  try {
    await checkDbConnection();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}..`);
    });
  } catch (error) {
    // log to loging file
  }
};

startServer();
