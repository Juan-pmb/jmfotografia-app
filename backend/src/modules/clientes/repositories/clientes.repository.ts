import { prisma } from "../../../lib/prisma.js";

export class ClientesRepository {
    async obtenerClientes() {
        return prisma.cliente.findMany({
            orderBy: {
                fechaCreacion: "desc",
            },
        });
    }

    async obtenerCliente(id: number) {
        return prisma.cliente.findUnique({
            where: { id },
        })
    }

    async crearCliente(data: any) {
        return prisma.cliente.create({
            data,
        });
    }

    async actualizarCliente(
        id: number,
        data: any,
    ) {
        return prisma.cliente.update({
            where: { id },
            data,
        });
    }
}