"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = exports.verifyJwtToken = exports.jwtForLogIn = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middlewares/errorHandler");
const jwtForLogIn = (id, isAdmin = false, exp = null) => {
    if (process.env.JwtSecretKey !== undefined) {
        return jsonwebtoken_1.default.sign({ userId: id, isAdmin }, process.env.JwtSecretKey, { expiresIn: "36500d" });
    }
    else {
        console.log("env variable JwtSecretKey not defined on server");
        throw new errorHandler_1.AppError("Server errror", 500);
    }
};
exports.jwtForLogIn = jwtForLogIn;
const verifyJwtToken = (token) => {
    if (process.env.JwtSecretKey !== undefined) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JwtSecretKey);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errorHandler_1.AppError("Unauthorized: Token expired", 401);
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errorHandler_1.AppError("Unauthorized: Invalid token", 401);
            }
            else {
                throw new errorHandler_1.AppError("Unauthorized: Invalid token", 401);
            }
        }
    }
    else {
        throw new errorHandler_1.AppError("env variable JwtSecretKey not defined on server", 500);
    }
};
exports.verifyJwtToken = verifyJwtToken;
const verifyAuthToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new errorHandler_1.AppError("Unauthorized: No token provided", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, exports.verifyJwtToken)(token);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyAuthToken = verifyAuthToken;
