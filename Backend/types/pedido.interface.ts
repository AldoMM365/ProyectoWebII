export interface Pedido {
    items: {
        id: number,
        nombre: string,
        precio: number,
        cantidad: number
    }[],
    total: number
}