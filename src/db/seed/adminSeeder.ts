import { encryptData } from "../../middlewares/bcrypt";
import { database } from "../db";

export const adminSeeder = async () => {
  try {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "password123";
    const defaultAdminName = "Default Admin";

    const existingAdmin = await database.admin.findUnique({ where: { email: defaultAdminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await encryptData(defaultAdminPassword);
      await database.admin.create({
        data: {
          email: defaultAdminEmail,
          password: hashedPassword,
          name: defaultAdminName,
        },
      });
      console.log("Default admin created successfully.");
    } else {
      console.log("Default admin already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};
