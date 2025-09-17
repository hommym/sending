import { adminSeeder } from "./adminSeeder";

const runSeeders = async () => {
  console.log("Running seeders...");
  await adminSeeder();
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
