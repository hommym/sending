"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDbConnection = exports.database = void 0;
const client_1 = require("@prisma/client");
exports.database = new client_1.PrismaClient();
const checkDbConnection = async () => {
    try {
        console.log("Connecting To Database..");
        exports.database.user.findMany({});
        console.log("Connection Sucessfull");
    }
    catch (error) {
        console.log(error);
        throw new Error("Database Connection Error...");
    }
};
exports.checkDbConnection = checkDbConnection;
