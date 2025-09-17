"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminSeeder_1 = require("./adminSeeder");
const runSeeders = async () => {
    console.log("Running seeders...");
    await (0, adminSeeder_1.adminSeeder)();
    console.log("Seeders finished.");
};
runSeeders()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    // Disconnect from Prisma if needed
});
