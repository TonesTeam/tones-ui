-- CreateTable
CREATE TABLE "GlobalStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datetime" DATETIME NOT NULL,
    "canStartProtocol" BOOLEAN NOT NULL,
    "errorId" INTEGER NOT NULL,
    CONSTRAINT "GlobalStatus_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "Error" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SlotStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotNum" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "globalStatusId" INTEGER,
    CONSTRAINT "SlotStatus_globalStatusId_fkey" FOREIGN KEY ("globalStatusId") REFERENCES "GlobalStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "liquidId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "washingId" INTEGER NOT NULL,
    CONSTRAINT "Protocol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Protocol_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Protocol_washingId_fkey" FOREIGN KEY ("washingId") REFERENCES "Washing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProtocolDeployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    CONSTRAINT "ProtocolDeployment_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeploymentLiquidConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolDeploymentId" INTEGER NOT NULL,
    "liquidSlotNumber" INTEGER NOT NULL,
    "liquidId" INTEGER NOT NULL,
    "liquidAmount" INTEGER NOT NULL,
    CONSTRAINT "DeploymentLiquidConfig_protocolDeploymentId_fkey" FOREIGN KEY ("protocolDeploymentId") REFERENCES "ProtocolDeployment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeploymentLiquidConfig_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Error" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "code" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DeploymentError" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolDeploymentId" INTEGER NOT NULL,
    "errorId" INTEGER NOT NULL,
    CONSTRAINT "DeploymentError_protocolDeploymentId_fkey" FOREIGN KEY ("protocolDeploymentId") REFERENCES "ProtocolDeployment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeploymentError_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "Error" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "UsedSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotId" INTEGER NOT NULL,
    "protocolDeploymentId" INTEGER NOT NULL,
    CONSTRAINT "UsedSlot_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsedSlot_protocolDeploymentId_fkey" FOREIGN KEY ("protocolDeploymentId") REFERENCES "ProtocolDeployment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Step" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "stepType" TEXT NOT NULL,
    CONSTRAINT "Step_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExecutedStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stepId" INTEGER NOT NULL,
    "slotId" INTEGER NOT NULL,
    "protocolDeploymentId" INTEGER NOT NULL,
    CONSTRAINT "ExecutedStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExecutedStep_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExecutedStep_protocolDeploymentId_fkey" FOREIGN KEY ("protocolDeploymentId") REFERENCES "ProtocolDeployment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiquidApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "liquidInfoId" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    "liquidIncubationTime" INTEGER NOT NULL,
    "incubationTemperature" INTEGER NOT NULL,
    "autoWash" BOOLEAN NOT NULL DEFAULT true,
    "permanentLiquidId" INTEGER,
    CONSTRAINT "LiquidApplication_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiquidApplication_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiquidApplication_permanentLiquidId_fkey" FOREIGN KEY ("permanentLiquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Washing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "iter" INTEGER NOT NULL,
    "incubationTime" INTEGER NOT NULL,
    "stepId" INTEGER,
    "liquidId" INTEGER NOT NULL,
    CONSTRAINT "Washing_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "PermanentLiquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Washing_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TemperatureChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceTemperature" INTEGER NOT NULL,
    "targetTemperature" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    CONSTRAINT "TemperatureChange_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiquidInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "liquidTypeId" INTEGER NOT NULL,
    CONSTRAINT "LiquidInfo_liquidTypeId_fkey" FOREIGN KEY ("liquidTypeId") REFERENCES "LiquidType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PermanentLiquid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortname" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "requiresCooling" BOOLEAN NOT NULL DEFAULT false,
    "liquidInfoId" INTEGER NOT NULL,
    CONSTRAINT "PermanentLiquid_liquidInfoId_fkey" FOREIGN KEY ("liquidInfoId") REFERENCES "LiquidInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiquidType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidApplication_stepId_key" ON "LiquidApplication"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "Washing_stepId_key" ON "Washing"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "TemperatureChange_stepId_key" ON "TemperatureChange"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentLiquid_liquidInfoId_key" ON "PermanentLiquid"("liquidInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidType_name_key" ON "LiquidType"("name");
