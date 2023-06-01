import { Injectable } from '@angular/core';
import {collection, collectionData, doc, Firestore, getDocs, query, updateDoc, where} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {SalesAutorInterface} from "../interfaces/salesAutor.interface";

@Injectable({
  providedIn: 'root'
})
export class SalesAutorService {

  constructor(private firestore$: Firestore) {}

  getLSalesAutor(): Observable<SalesAutorInterface[]> {
    const instrumentRef = collection(this.firestore$, 'ventasAutor');
    return collectionData(instrumentRef, {idField: 'id'}) as Observable<SalesAutorInterface[]>
  }

  filterByUser(userId: string, state: boolean) {
    const collectionRef = collection(this.firestore$, "ventasAutor");
    const q = query(collectionRef, where("autor.numeroDocumento", "==", userId), where("estado", '==', state));
    return getDocs(q)
  }

  updateSalesAutor(newState: boolean, idDocument: string) {
    const userCoinRef = doc(this.firestore$, "ventasAutor", idDocument);
    return updateDoc(userCoinRef, {
      estado: newState ,
    })
  }
}
