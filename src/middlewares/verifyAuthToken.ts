// Custom data types
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "./errorHandler";
import { verifyJwtToken } from "../utils/jwt";
import { database } from "../db/db";


export const verifyJwt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // console.log("Jwt verification began....");
  if (req.headers !== undefined && req.headers.authorization !== undefined) {
    if (!req.headers.authorization.startsWith("Bearer ")) {
      res.status(400);
      throw new AppError("Bad Request Bearer schema not found in Header", 400);
    }

    try {
      const jwtData = verifyJwtToken(req.headers.authorization.split(" ")[1]) as JwtPayload;
      //  if (!jwtData.userId) {
      //    throw new AppError("Token has expired or is not valid", 401);
      //  }
      //  console.log("Jwt token Verified");

      // the if statement is temporary
      if (!(await database.user.findUnique({ where: { id: jwtData.userId } }))) throw new AppError("", 404);
      req.body.verifiedUserId = jwtData.userId;
      next();
    } catch (error) {
      throw new AppError("Token has expired or is not valid", 401);
    }
  } else {
    throw new AppError("Authorization Header not defined", 400);
  }
});


