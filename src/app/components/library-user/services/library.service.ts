import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore, getDocs, query, where} from "@angular/fire/firestore";
import {ProductInterface} from "../interfaces/product.interface";
import {getDownloadURL, getStorage, ref} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private firestore$: Firestore) { }

  addItem(product: ProductInterface) {
    const instrumentRef = collection(this.firestore$, 'biblioteca');
    return addDoc(instrumentRef, product)
  }

  getItems(uid : string){
    const collectionRef = collection(this.firestore$, "biblioteca");
    const q = query(collectionRef, where("uid", "==", uid));
    return getDocs(q)
  }



}
