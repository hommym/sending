import { PrismaClient } from "@prisma/client";


export const database = new PrismaClient();

export const checkDbConnection = async () => {
  try {
    console.log("Connecting To Database..");
    database.user.findMany({});
    console.log("Connection Sucessfull");
  } catch (error) {
    console.log(error);
    throw new Error("Database Connection Error...");
  }
};

