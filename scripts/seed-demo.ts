import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { assertLocalDemoEnvironment } from "../lib/demo-data";
import { seedDemo } from "../lib/demo-seed";

async function main() {
  config({ quiet: true });
  assertLocalDemoEnvironment(process.env);
  const prisma = new PrismaClient();
  try {
    console.log(JSON.stringify(await seedDemo(prisma), null, 2));
  } finally {
    await prisma.$disconnect();
  }
}
main().catch(error => {
  // Prisma connection errors may contain connection details; never print them.
  console.error(error instanceof Error && /Demo seed|local MySQL|Reserved demo slug/.test(error.message)
    ? error.message : "Demo seed failed; transaction rolled back. Check local database availability and applied schema.");
  process.exitCode = 1;
});
