-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Protocol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL,
    "lastUpdate" DATETIME,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "lastUserId" INTEGER,
    "liquidId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "washingId" INTEGER NOT NULL,
    CONSTRAINT "Protocol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Protocol_lastUserId_fkey" FOREIGN KEY ("lastUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Protocol_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Protocol_washingId_fkey" FOREIGN KEY ("washingId") REFERENCES "Washing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Protocol" ("creationDate", "deleted", "description", "id", "liquidId", "name", "userId", "washingId") SELECT "creationDate", "deleted", "description", "id", "liquidId", "name", "userId", "washingId" FROM "Protocol";
DROP TABLE "Protocol";
ALTER TABLE "new_Protocol" RENAME TO "Protocol";
CREATE TABLE "new_PermanentLiquid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortname" TEXT,
    "toxic" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "requiresCooling" BOOLEAN NOT NULL DEFAULT false,
    "liquidInfoId" INTEGER NOT NULL,
    CONSTRAINT "PermanentLiquid_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PermanentLiquid" ("deleted", "id", "liquidInfoId", "requiresCooling", "shortname", "toxic") SELECT "deleted", "id", "liquidInfoId", "requiresCooling", "shortname", "toxic" FROM "PermanentLiquid";
DROP TABLE "PermanentLiquid";
ALTER TABLE "new_PermanentLiquid" RENAME TO "PermanentLiquid";
CREATE UNIQUE INDEX "PermanentLiquid_liquidInfoId_key" ON "PermanentLiquid"("liquidInfoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
