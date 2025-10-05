-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Step" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "stepType" TEXT NOT NULL,
    "iterations" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Step_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Step" ("id", "protocolId", "sequenceOrder", "stepType") SELECT "id", "protocolId", "sequenceOrder", "stepType" FROM "Step";
DROP TABLE "Step";
ALTER TABLE "new_Step" RENAME TO "Step";
CREATE TABLE "new_Washing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "incubationTime" INTEGER NOT NULL,
    "permanentLiquidId" INTEGER NOT NULL,
    "stepId" INTEGER,
    "iter" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Washing_permanentLiquidId_fkey" FOREIGN KEY ("permanentLiquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Washing_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Washing" ("id", "incubationTime", "iter", "permanentLiquidId", "stepId") SELECT "id", "incubationTime", "iter", "permanentLiquidId", "stepId" FROM "Washing";
DROP TABLE "Washing";
ALTER TABLE "new_Washing" RENAME TO "Washing";
CREATE UNIQUE INDEX "Washing_stepId_key" ON "Washing"("stepId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
