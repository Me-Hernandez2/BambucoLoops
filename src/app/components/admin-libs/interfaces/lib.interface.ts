import {AutorInterface} from "../../admin-authors/interfaces/autor.interface";

export default interface LibInterface {
    id?: string;
    nombre: string,
    autor: AutorInterface,
    descripcion: string,
    precio: string,
    cantidadLoops: string,
    tipoProducto: string,
    audioPreview: any,
    refAudioPreview: any,
    audioVenta: any,
    refAudioVenta: any,
    cover: any,
    refCover: any,
}