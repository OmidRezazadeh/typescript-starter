/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL,
    "national_code" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "max_checkout" INTEGER,
    "password" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "profile_status" TEXT NOT NULL DEFAULT 'incomplete',
    "account_no" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "tell" TEXT,
    "avatar" TEXT,
    "about_me" TEXT,
    "email" TEXT NOT NULL,
    "my_website" TEXT,
    "ref_id" TEXT,
    "reference" TEXT,
    "sms" BOOLEAN NOT NULL DEFAULT true,
    "checkout" INTEGER NOT NULL DEFAULT 0,
    "access_panel" BOOLEAN NOT NULL DEFAULT false,
    "block" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_national_code_key" ON "users"("national_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
