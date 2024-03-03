-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Step" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "stepType" TEXT NOT NULL,
    CONSTRAINT "Step_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Step" ("id", "protocolId", "sequenceOrder", "stepType") SELECT "id", "protocolId", "sequenceOrder", "stepType" FROM "Step";
DROP TABLE "Step";
ALTER TABLE "new_Step" RENAME TO "Step";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
