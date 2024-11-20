/*
  Warnings:

  - Added the required column `rssi` to the `DataRecived` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataRecived" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "timestamp_sent_lora" DATETIME NOT NULL,
    "timestamp_sent_mqtt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestamp_saved_db" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rssi" INTEGER NOT NULL
);
INSERT INTO "new_DataRecived" ("id", "timestamp_saved_db", "timestamp_sent_lora", "timestamp_sent_mqtt", "value") SELECT "id", "timestamp_saved_db", "timestamp_sent_lora", "timestamp_sent_mqtt", "value" FROM "DataRecived";
DROP TABLE "DataRecived";
ALTER TABLE "new_DataRecived" RENAME TO "DataRecived";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
