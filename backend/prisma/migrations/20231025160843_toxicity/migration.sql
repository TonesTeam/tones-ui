-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PermanentLiquid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortname" TEXT,
    "toxic" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "requiresCooling" BOOLEAN NOT NULL DEFAULT false,
    "liquidInfoId" INTEGER NOT NULL,
    CONSTRAINT "PermanentLiquid_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PermanentLiquid" ("deleted", "id", "liquidInfoId", "requiresCooling", "shortname") SELECT "deleted", "id", "liquidInfoId", "requiresCooling", "shortname" FROM "PermanentLiquid";
DROP TABLE "PermanentLiquid";
ALTER TABLE "new_PermanentLiquid" RENAME TO "PermanentLiquid";
CREATE UNIQUE INDEX "PermanentLiquid_liquidInfoId_key" ON "PermanentLiquid"("liquidInfoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
