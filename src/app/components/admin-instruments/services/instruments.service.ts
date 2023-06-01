import { Injectable } from '@angular/core';
import {collection, addDoc, Firestore, collectionData, doc, deleteDoc} from "@angular/fire/firestore";
import instrument from "../interfaces/instrument.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {

  constructor(private firestore$: Firestore) { }

  addInstrument(instrument: instrument){
    const instrumentRef = collection(this.firestore$, 'instrumentos');
    return addDoc(instrumentRef, instrument)
  }

  getInstruments(): Observable<instrument[]> {
    const instrumentRef = collection(this.firestore$, 'instrumentos');
    return collectionData(instrumentRef, {idField: 'id'}) as Observable<instrument[]>
  }

  deleteInstrument(instrument: instrument){
    const instrumentRef = doc(this.firestore$, `instrumentos/${instrument.id}`);
    return deleteDoc(instrumentRef);
  }
}
