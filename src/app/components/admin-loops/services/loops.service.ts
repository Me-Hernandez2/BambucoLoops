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
import loop from "../interfaces/loop.interface";


@Injectable({
  providedIn: 'root'
})
export class LoopsService {

  constructor(private firestore$: Firestore) { }

  addLoop(instrument: loop){
    const instrumentRef = collection(this.firestore$, 'loops');
    return addDoc(instrumentRef, instrument)
  }

  getLoops(): Observable<loop[]> {
    const instrumentRef = collection(this.firestore$, 'loops');
    return collectionData(instrumentRef, {idField: 'id'}) as Observable<loop[]>
  }

  deleteLoop(loop: loop){
    const instrumentRef = doc(this.firestore$, `loops/${loop.id}`);
    return deleteDoc(instrumentRef);
  }

  filterByInstrument(instrument: string){
    const collectionRef = collection(this.firestore$, "loops");
    const q = query(collectionRef, where("instrumento", "==", instrument));
    return getDocs(q)
  }
}
