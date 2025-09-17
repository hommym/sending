"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSeeder = void 0;
const bcrypt_1 = require("../../utils/bcrypt");
const db_1 = require("../db");
const adminSeeder = async () => {
    try {
        const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
        const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "password123";
        const defaultAdminName = "Default Admin";
        const existingAdmin = await db_1.database.admin.findUnique({ where: { email: defaultAdminEmail } });
        if (!existingAdmin) {
            const hashedPassword = await (0, bcrypt_1.encryptData)(defaultAdminPassword);
            await db_1.database.admin.create({
                data: {
                    email: defaultAdminEmail,
                    password: hashedPassword,
                    name: defaultAdminName,
                },
            });
            console.log("Default admin created successfully.");
        }
        else {
            console.log("Default admin already exists.");
        }
    }
    catch (error) {
        console.error("Error seeding admin:", error);
    }
};
exports.adminSeeder = adminSeeder;
