/*
  Warnings:

  - You are about to drop the column `altitude` on the `DataRecived` table. All the data in the column will be lost.
  - You are about to drop the column `pressure` on the `DataRecived` table. All the data in the column will be lost.
  - You are about to drop the column `received_at` on the `DataRecived` table. All the data in the column will be lost.
  - You are about to drop the column `saved_at` on the `DataRecived` table. All the data in the column will be lost.
  - You are about to drop the column `sended_at` on the `DataRecived` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `DataRecived` table. All the data in the column will be lost.
  - Added the required column `timestamp_sent_lora` to the `DataRecived` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `DataRecived` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataRecived" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "timestamp_sent_lora" DATETIME NOT NULL,
    "timestamp_sent_mqtt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestamp_saved_db" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DataRecived" ("id") SELECT "id" FROM "DataRecived";
DROP TABLE "DataRecived";
ALTER TABLE "new_DataRecived" RENAME TO "DataRecived";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
