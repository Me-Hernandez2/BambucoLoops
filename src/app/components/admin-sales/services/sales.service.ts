import {Injectable} from '@angular/core';
import loop from "../../admin-loops/interfaces/loop.interface";
import {
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    Firestore,
    getDocs,
    query, updateDoc,
    where
} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import sale from "../interfaces/sales.interface";
import coin from "../interfaces/coin.interface";
import reloadCredits from "../../reload-credits/interfaces/reloadCredits.interface";
import {UpdateCoinsService} from "../../../shared/services/updateCoins.service";
import {AuthorSalesInterface} from "../../reload-credits/interfaces/authorSales.interface";

@Injectable({
    providedIn: 'root'
})
export class SalesService {

    constructor(private firestore$: Firestore) {
    }

    addSale(sale: reloadCredits) {
        const instrumentRef = collection(this.firestore$, 'ventas');
        return addDoc(instrumentRef, sale)
    }

    addSaleAuthor(sale: AuthorSalesInterface) {
        const instrumentRef = collection(this.firestore$, 'ventasAutor');
        return addDoc(instrumentRef, sale)
    }

    getLSales(){
        const collectionRef = collection(this.firestore$, 'ventas');
        const q = query(collectionRef, where("estado", "==", "PENDIENTE DE GESTION"))
        //return collectionData(instrumentRef, {idField: 'id'}) as Observable<sale[]>
        return getDocs(q)
    }

    deleteSale(loop: loop) {
        const instrumentRef = doc(this.firestore$, `ventas/${loop.id}`);
        return deleteDoc(instrumentRef);
    }

    filterByUser(user: string) {
        const collectionRef = collection(this.firestore$, "ventas");
        const q = query(collectionRef, where("usuario", "==", user));
        return getDocs(q)
    }

    filterByAutor(user: string) {
        const collectionRef = collection(this.firestore$, "ventas");
        const q = query(collectionRef, where("autor", "==", user));
        return getDocs(q)
    }

    async filterCoinsUser(coins: number, uid: string) {
        const collectionRef = collection(this.firestore$, "coins");
        const q = query(collectionRef, where("uidUsuario", "==", uid));
        await getDocs(q).then(
            res => {
                res.forEach((doc) => {
                    this.updateCoinsUser(coins, doc.id, doc.data().coins)

                })
                if (res.docs.length == 0) {
                    this.createCoinsUser(coins, uid)
                }
            }
        ).catch(error => console.error(error));
        /*
        */
    }

    subtractCredits(loop: loop, uid: string) {
        const collectionRef = collection(this.firestore$, "coins");
        const q = query(collectionRef, where("uidUsuario", "==", uid));
        return getDocs(q)
    }

     getCredits(uid: string) {
        const collectionRef = collection(this.firestore$, "coins");
        const q = query(collectionRef, where("uidUsuario", "==", uid));
        return getDocs(q)
    }

    createCoinsUser(coins, uid) {
        const payload: coin = {
            uidUsuario: uid,
            coins: coins
        }
        const instrumentRef = collection(this.firestore$, 'coins');
        addDoc(instrumentRef, payload)
    }

    updateCoinsUser(coins: number, idDocument: string, coinsUser?: number) {
        console.log(idDocument)
        let newCoins = Number(coinsUser) ? Number(coinsUser) + Number(coins) : Number(coins)
        const userCoinRef = doc(this.firestore$, "coins", idDocument);
        return updateDoc(userCoinRef, {
            coins: newCoins ,
        })
    }

    updateSaleState(state: string, idDocument: string){
        const saleRef = doc(this.firestore$, "ventas", idDocument)
        return updateDoc(saleRef, {
            estado: state
        })
    }


}
