import { Injectable } from '@angular/core';
import {Auth, signInWithPopup, GoogleAuthProvider, signOut, authState} from "@angular/fire/auth";
import {Observable} from "rxjs";
import loop from "../../components/admin-loops/interfaces/loop.interface";
import {addDoc, collection, collectionData, Firestore} from "@angular/fire/firestore";
import {User} from "../../shared/navbar/interfaces/login.interface";

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  constructor(private _auth : Auth,
              private firestore$: Firestore) {
  }

  login(){
    return signInWithPopup(this._auth, new GoogleAuthProvider())
  }

  logout(){
    return signOut(this._auth);
  }

  isLogged(){
    return authState(this._auth)
  }

  termsAccept(): Observable<any>{
      const instrumentRef = collection(this.firestore$, 'usuariosAceptacionTyC');
      return collectionData(instrumentRef, {idField: 'id'}) as Observable<any[]>
  }

  userAcceptTerms(email: string){
    const instrumentRef = collection(this.firestore$, 'usuariosAceptacionTyC');
    const payload = {email: email}
    return addDoc(instrumentRef, payload)
  }


}
