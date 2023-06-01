import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {SalesService} from "../../components/admin-sales/services/sales.service";

@Injectable({
    providedIn: 'root'
})

export class UpdateCoinsService {
    coins$ = new Subject<number>()
    currentUser = JSON.parse(sessionStorage.getItem('userData'))
    constructor(private salesService$: SalesService,) { }

    update(){
        const currentUser = JSON.parse(sessionStorage.getItem('userData'))
        if(!!currentUser)
        this.salesService$.getCredits(currentUser.user.uid).then( res => {
            res.forEach((doc) => {
                this.coins$.next(doc.data().coins);
            })
        }).catch( error => {
            this.coins$.next(0);
            console.log(error)
        })

    }
}