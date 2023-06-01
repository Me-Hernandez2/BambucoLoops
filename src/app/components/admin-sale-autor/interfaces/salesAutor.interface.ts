export interface SalesAutorInterface {
    id?: string;
    autor: Autor
    estado: boolean,
    fecha: number,
    producto: Producto
}

export interface Autor {
    id: string,
    nombre: string,
    numeroDocumento: string
}

export interface Producto {
    nombreProducto: string,
    precio: number
}