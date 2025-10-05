-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PermanentLiquid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortname" TEXT,
    "toxic" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "requiresCooling" BOOLEAN NOT NULL DEFAULT false,
    "liquidInfoId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT -1,
    CONSTRAINT "PermanentLiquid_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PermanentLiquid" ("deleted", "id", "liquidInfoId", "requiresCooling", "shortname", "toxic") SELECT "deleted", "id", "liquidInfoId", "requiresCooling", "shortname", "toxic" FROM "PermanentLiquid";
DROP TABLE "PermanentLiquid";
ALTER TABLE "new_PermanentLiquid" RENAME TO "PermanentLiquid";
CREATE UNIQUE INDEX "PermanentLiquid_liquidInfoId_key" ON "PermanentLiquid"("liquidInfoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
