import {AutorInterface} from "../../admin-authors/interfaces/autor.interface";

export default interface loop {
    id?: string;
    nombre: string;
    autor: AutorInterface;
    descripcion: string;
    instrumento: string;
    precio: string;
    audioPreview: any;
    refAudioPreview: any;
    audioVenta: any;
    refAudioVenta: any;
    cover: any;
    refCover: any;
    tipoProducto: any;
}
