-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Step" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "stepType" TEXT NOT NULL,
    CONSTRAINT "Step_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Step" ("id", "protocolId", "sequenceOrder", "stepType") SELECT "id", "protocolId", "sequenceOrder", "stepType" FROM "Step";
DROP TABLE "Step";
ALTER TABLE "new_Step" RENAME TO "Step";
CREATE TABLE "new_TemperatureChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceTemperature" INTEGER NOT NULL,
    "targetTemperature" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    CONSTRAINT "TemperatureChange_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TemperatureChange" ("id", "sourceTemperature", "stepId", "targetTemperature") SELECT "id", "sourceTemperature", "stepId", "targetTemperature" FROM "TemperatureChange";
DROP TABLE "TemperatureChange";
ALTER TABLE "new_TemperatureChange" RENAME TO "TemperatureChange";
CREATE UNIQUE INDEX "TemperatureChange_stepId_key" ON "TemperatureChange"("stepId");
CREATE TABLE "new_LiquidApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "liquidInfoId" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    "liquidIncubationTime" INTEGER NOT NULL,
    "incubationTemperature" INTEGER NOT NULL,
    "autoWash" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "LiquidApplication_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiquidApplication_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LiquidApplication" ("autoWash", "id", "incubationTemperature", "liquidIncubationTime", "liquidInfoId", "stepId") SELECT "autoWash", "id", "incubationTemperature", "liquidIncubationTime", "liquidInfoId", "stepId" FROM "LiquidApplication";
DROP TABLE "LiquidApplication";
ALTER TABLE "new_LiquidApplication" RENAME TO "LiquidApplication";
CREATE UNIQUE INDEX "LiquidApplication_stepId_key" ON "LiquidApplication"("stepId");
CREATE TABLE "new_Washing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "iter" INTEGER NOT NULL,
    "incubationTime" INTEGER NOT NULL,
    "permanentLiquidId" INTEGER NOT NULL,
    "stepId" INTEGER,
    CONSTRAINT "Washing_permanentLiquidId_fkey" FOREIGN KEY ("permanentLiquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Washing_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Washing" ("id", "incubationTime", "iter", "permanentLiquidId", "stepId") SELECT "id", "incubationTime", "iter", "permanentLiquidId", "stepId" FROM "Washing";
DROP TABLE "Washing";
ALTER TABLE "new_Washing" RENAME TO "Washing";
CREATE UNIQUE INDEX "Washing_stepId_key" ON "Washing"("stepId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
