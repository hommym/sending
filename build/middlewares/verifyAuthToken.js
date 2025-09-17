"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHandler_1 = require("./errorHandler");
const jwt_1 = require("../utils/jwt");
const db_1 = require("../db/db");
exports.verifyJwt = (0, express_async_handler_1.default)(async (req, res, next) => {
    // console.log("Jwt verification began....");
    if (req.headers !== undefined && req.headers.authorization !== undefined) {
        if (!req.headers.authorization.startsWith("Bearer ")) {
            res.status(400);
            throw new errorHandler_1.AppError("Bad Request Bearer schema not found in Header", 400);
        }
        try {
            const jwtData = (0, jwt_1.verifyJwtToken)(req.headers.authorization.split(" ")[1]);
            //  if (!jwtData.userId) {
            //    throw new AppError("Token has expired or is not valid", 401);
            //  }
            //  console.log("Jwt token Verified");
            // the if statement is temporary
            if (!(await db_1.database.user.findUnique({ where: { id: jwtData.userId } })))
                throw new errorHandler_1.AppError("", 404);
            req.body.verifiedUserId = jwtData.userId;
            next();
        }
        catch (error) {
            throw new errorHandler_1.AppError("Token has expired or is not valid", 401);
        }
    }
    else {
        throw new errorHandler_1.AppError("Authorization Header not defined", 400);
    }
});
