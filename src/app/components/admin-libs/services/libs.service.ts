import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  where
} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import LibInterface from "../interfaces/lib.interface";

@Injectable({
  providedIn: 'root'
})
export class LibsService {

  constructor(private firestore$: Firestore) { }

  addLib(libreria: LibInterface){
    const instrumentRef = collection(this.firestore$, 'librerias');
    return addDoc(instrumentRef, libreria)
  }

  getLibs(): Observable<LibInterface[]> {
    const instrumentRef = collection(this.firestore$, 'librerias');
    return collectionData(instrumentRef, {idField: 'id'}) as Observable<any[]>
  }

  deleteLibs(libreria: LibInterface){
    const instrumentRef = doc(this.firestore$, `librerias/${libreria.id}`);
    return deleteDoc(instrumentRef);
  }

}
