-- CreateTable
CREATE TABLE "Protocol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL,
    "comment" TEXT,
    "userId" INTEGER NOT NULL,
    "liquidId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Protocol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Protocol_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "Liquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProtocolDeployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolId" INTEGER NOT NULL,
    "liquidAmount" INTEGER NOT NULL,
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
    CONSTRAINT "DeploymentLiquidConfig_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "Liquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeploymentError" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolDeploymentId" INTEGER NOT NULL,
    "error" TEXT NOT NULL,
    CONSTRAINT "DeploymentError_protocolDeploymentId_fkey" FOREIGN KEY ("protocolDeploymentId") REFERENCES "ProtocolDeployment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "protocolId" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    "slotId" INTEGER NOT NULL,
    CONSTRAINT "ExecutedStep_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExecutedStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExecutedStep_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiquidApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "liquidIncubationTime" INTEGER NOT NULL,
    "washingIncubationTime" INTEGER,
    "doWash" BOOLEAN NOT NULL DEFAULT true,
    "liquidId" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    CONSTRAINT "LiquidApplication_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "Liquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiquidApplication_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Washing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "times" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    "liquidId" INTEGER NOT NULL,
    CONSTRAINT "Washing_liquidId_fkey" FOREIGN KEY ("liquidId") REFERENCES "Liquid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Washing_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TemperatureChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetTemperature" INTEGER NOT NULL,
    "blocking" BOOLEAN NOT NULL,
    "returnToNormal" BOOLEAN NOT NULL,
    "stepId" INTEGER NOT NULL,
    CONSTRAINT "TemperatureChange_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Liquid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortname" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "requiresCooling" BOOLEAN NOT NULL,
    "maxTemp" INTEGER NOT NULL,
    "liquidTypeId" INTEGER NOT NULL,
    CONSTRAINT "Liquid_liquidTypeId_fkey" FOREIGN KEY ("liquidTypeId") REFERENCES "LiquidType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiquidType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LiquidApplication_stepId_key" ON "LiquidApplication"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "Washing_stepId_key" ON "Washing"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "TemperatureChange_stepId_key" ON "TemperatureChange"("stepId");
