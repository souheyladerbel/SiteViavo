-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logoUrl" TEXT,
    "themeMode" TEXT NOT NULL DEFAULT 'LIGHT',
    "primaryColor" TEXT NOT NULL DEFAULT '#111827',
    "secondaryColor" TEXT NOT NULL DEFAULT '#d97706',
    "homeHeroTitle" TEXT NOT NULL DEFAULT 'Bienvenue',
    "homeHeroSubtitle" TEXT NOT NULL DEFAULT 'Découvrez nos produits',
    "homeCtaText" TEXT NOT NULL DEFAULT 'Voir la boutique',
    "homeCtaHref" TEXT NOT NULL DEFAULT '/products',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CarouselImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "priceInCents" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "mainImageUrl" TEXT,
    "videoUrl" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "isPromotion" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bestSellerOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "isArchived", "isBestSeller", "isPromotion", "isVisible", "mainImageUrl", "name", "priceInCents", "slug", "stock", "updatedAt", "videoUrl") SELECT "categoryId", "createdAt", "description", "id", "isArchived", "isBestSeller", "isPromotion", "isVisible", "mainImageUrl", "name", "priceInCents", "slug", "stock", "updatedAt", "videoUrl" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
