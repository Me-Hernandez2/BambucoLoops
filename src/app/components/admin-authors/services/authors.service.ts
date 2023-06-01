import { Injectable } from '@angular/core';
import {addDoc, collection, collectionData, Firestore} from "@angular/fire/firestore";
import {AutorInterface} from "../interfaces/autor.interface";
import {Observable} from "rxjs";
import loop from "../../admin-loops/interfaces/loop.interface";


@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  constructor(private firestore$: Firestore) { }

  addAuthor(instrument: AutorInterface){
    const instrumentRef = collection(this.firestore$, 'autores');
    return addDoc(instrumentRef, instrument)
  }

  getAuthors(): Observable<AutorInterface[]> {
    const instrumentRef = collection(this.firestore$, 'autores');
    return collectionData(instrumentRef, {idField: 'id'}) as Observable<AutorInterface[]>
  }
}
