-- CreateTable
CREATE TABLE "RequestInfo" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredStartDate" TIMESTAMP(3),
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "tourId" TEXT,
    "tourName" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestInfo_email_idx" ON "RequestInfo"("email");

-- CreateIndex
CREATE INDEX "RequestInfo_createdAt_idx" ON "RequestInfo"("createdAt");
