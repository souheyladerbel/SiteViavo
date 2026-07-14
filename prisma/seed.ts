import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "superadmin@example.com";
  const password = "Admin@12345";

  const passwordHash = await hash(password, 12);

  const superAdmin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("Super Admin created:");
  console.log("Email:", superAdmin.email);
  console.log("Password:", password);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });