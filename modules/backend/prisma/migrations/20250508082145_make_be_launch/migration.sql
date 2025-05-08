-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProtocolDeployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    CONSTRAINT "ProtocolDeployment_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProtocolDeployment" ("id", "protocolId") SELECT "id", "protocolId" FROM "ProtocolDeployment";
DROP TABLE "ProtocolDeployment";
ALTER TABLE "new_ProtocolDeployment" RENAME TO "ProtocolDeployment";
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
