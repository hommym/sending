"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("./utils/jsonSerializer");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./router");
const errorHandler_1 = require("./middlewares/errorHandler");
const db_1 = require("./db/db");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
// middlewares
exports.app.use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], credentials: true }));
// routes
exports.app.use("/api", router_1.httpRouter);
// error handling middlware
exports.app.use(errorHandler_1.errorHandler);
// ws middleware
// ws.use(verifyJwtForWs)
//ws routes
// wsRouter("/ws");
const port = process.env.PORT ? process.env.PORT : 8000;
const startServer = async () => {
    try {
        await (0, db_1.checkDbConnection)();
        exports.app.listen(port, () => {
            console.log(`Server listening on port ${port}..`);
        });
    }
    catch (error) {
        // log to loging file
    }
};
startServer();
