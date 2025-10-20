-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiquidApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "liquidInfoId" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    "liquidIncubationTime" INTEGER NOT NULL,
    "incubationTemperature" INTEGER NOT NULL,
    "autoWash" BOOLEAN NOT NULL DEFAULT true,
    "washingIterations" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LiquidApplication_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiquidApplication_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LiquidApplication" ("autoWash", "id", "incubationTemperature", "liquidIncubationTime", "liquidInfoId", "stepId") SELECT "autoWash", "id", "incubationTemperature", "liquidIncubationTime", "liquidInfoId", "stepId" FROM "LiquidApplication";
DROP TABLE "LiquidApplication";
ALTER TABLE "new_LiquidApplication" RENAME TO "LiquidApplication";
CREATE UNIQUE INDEX "LiquidApplication_stepId_key" ON "LiquidApplication"("stepId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
