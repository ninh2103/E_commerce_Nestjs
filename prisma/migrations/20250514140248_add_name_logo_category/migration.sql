/*
  Warnings:

  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

create unique index "Category_translation_categoryId_languageId_unique" on "CategoryTranslation"("categoryId", "languageId") where "deletedAt" is null;
