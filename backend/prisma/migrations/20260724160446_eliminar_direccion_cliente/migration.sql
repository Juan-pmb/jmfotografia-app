/*
  Warnings:

  - You are about to drop the column `direccion` on the `Cliente` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT,
    "documento" TEXT,
    "telefono" TEXT NOT NULL,
    "telefonoAlt" TEXT,
    "correo" TEXT,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL
);
INSERT INTO "new_Cliente" ("activo", "apellidos", "correo", "documento", "fechaActualiza", "fechaCreacion", "id", "nombres", "observaciones", "telefono", "telefonoAlt") SELECT "activo", "apellidos", "correo", "documento", "fechaActualiza", "fechaCreacion", "id", "nombres", "observaciones", "telefono", "telefonoAlt" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_documento_key" ON "Cliente"("documento");
CREATE INDEX "Cliente_nombres_idx" ON "Cliente"("nombres");
CREATE INDEX "Cliente_telefono_idx" ON "Cliente"("telefono");
CREATE INDEX "Cliente_apellidos_idx" ON "Cliente"("apellidos");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
