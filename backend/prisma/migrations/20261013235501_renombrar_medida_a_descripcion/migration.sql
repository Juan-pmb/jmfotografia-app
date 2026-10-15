/*
  Warnings:

  - You are about to drop the column `medida` on the `VarianteProducto` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VarianteProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioBase" INTEGER NOT NULL,
    "bajoPedido" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "productoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL,
    CONSTRAINT "VarianteProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_VarianteProducto" ("activo", "bajoPedido", "fechaActualiza", "fechaCreacion", "id", "nombre", "orden", "precioBase", "productoId") SELECT "activo", "bajoPedido", "fechaActualiza", "fechaCreacion", "id", "nombre", "orden", "precioBase", "productoId" FROM "VarianteProducto";
DROP TABLE "VarianteProducto";
ALTER TABLE "new_VarianteProducto" RENAME TO "VarianteProducto";
CREATE UNIQUE INDEX "VarianteProducto_productoId_nombre_descripcion_key" ON "VarianteProducto"("productoId", "nombre", "descripcion");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
