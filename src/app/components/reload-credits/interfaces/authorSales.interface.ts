import {AutorInterface} from "../../admin-authors/interfaces/autor.interface";

export interface AuthorSalesInterface {
    autor: AutorInterface;
    producto: {
        nombreProducto: string;
        precio: number;
    }
    estado: boolean;
    fecha: number;
}