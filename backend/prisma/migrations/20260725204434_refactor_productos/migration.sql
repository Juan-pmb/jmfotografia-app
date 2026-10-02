/*
  Warnings:

  - You are about to drop the column `descripcion` on the `DetallePedido` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `precioBase` on the `Producto` table. All the data in the column will be lost.
  - Made the column `categoria` on table `Producto` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "VarianteProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "medida" TEXT,
    "precioBase" INTEGER NOT NULL,
    "bajoPedido" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "productoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL,
    CONSTRAINT "VarianteProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetallePedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "varianteId" INTEGER,
    "nombreProducto" TEXT NOT NULL,
    "nombreVariante" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" INTEGER NOT NULL,
    "descuento" INTEGER NOT NULL DEFAULT 0,
    "subtotal" INTEGER NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productoId" INTEGER,
    CONSTRAINT "DetallePedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DetallePedido_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "VarianteProducto" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DetallePedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DetallePedido" ("cantidad", "descuento", "fechaCreacion", "id", "nombreProducto", "pedidoId", "precioUnitario", "productoId", "subtotal") SELECT "cantidad", "descuento", "fechaCreacion", "id", "nombreProducto", "pedidoId", "precioUnitario", "productoId", "subtotal" FROM "DetallePedido";
DROP TABLE "DetallePedido";
ALTER TABLE "new_DetallePedido" RENAME TO "DetallePedido";
CREATE INDEX "DetallePedido_pedidoId_idx" ON "DetallePedido"("pedidoId");
CREATE INDEX "DetallePedido_varianteId_idx" ON "DetallePedido"("varianteId");
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL
);
INSERT INTO "new_Producto" ("activo", "categoria", "fechaActualiza", "fechaCreacion", "id", "nombre") SELECT "activo", "categoria", "fechaActualiza", "fechaCreacion", "id", "nombre" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE INDEX "Producto_nombre_idx" ON "Producto"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VarianteProducto_productoId_nombre_medida_key" ON "VarianteProducto"("productoId", "nombre", "medida");
