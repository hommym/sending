import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";

export const jwtForLogIn = (id: string | number, isAdmin: boolean = false, exp: string | null = null): string => {
  if (process.env.JwtSecretKey !== undefined) {
    return jwt.sign({ userId: id, isAdmin }, process.env.JwtSecretKey, { expiresIn: "36500d" });
  } else {
    console.log("env variable JwtSecretKey not defined on server");
    throw new AppError("Server errror", 500);
  }
};

export const verifyJwtToken = (token: string) => {
  if (process.env.JwtSecretKey !== undefined) {
    try {
      return jwt.verify(token, process.env.JwtSecretKey) as JwtPayload & { userId: number | string; isAdmin: boolean };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("Unauthorized: Token expired", 401);
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Unauthorized: Invalid token", 401);
      } else {
        throw new AppError("Unauthorized: Invalid token", 401);
      }
    }
  } else {
    throw new AppError("env variable JwtSecretKey not defined on server", 500);
  }
};

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwtToken(token);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    next(error);
  }
};
