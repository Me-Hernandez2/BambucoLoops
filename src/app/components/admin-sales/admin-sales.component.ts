import {Component, OnInit} from '@angular/core';
import sale from "./interfaces/sales.interface";
import {SalesService} from "./services/sales.service";
import Swal from 'sweetalert2'
import {getAuth, updateProfile} from "@firebase/auth";
import {UpdateCoinsService} from "../../shared/services/updateCoins.service";
import {error} from "ajv/dist/vocabularies/applicator/dependencies";
import {SpinnerService} from "../../shared/services/spinner.service";

@Component({
    selector: 'app-admin-sales',
    templateUrl: './admin-sales.component.html',
    styleUrls: ['./admin-sales.component.scss']
})
export class AdminSalesComponent implements OnInit {
    salesLS: sale[] = [];
    userFilter = ''
    productTypeSelected: any

    constructor(private salesService: SalesService,
                private updateCoins$: UpdateCoinsService,
                private spinerService$: SpinnerService) {
    }

    ngOnInit(): void {
        this.listSales();
    }

    listSales() {
        this.spinerService$.show()
        this.salesLS = []
        this.salesService.getLSales().then(res => {
            res.forEach((doc) => {
                let item = doc.data() as sale;
                item.id = doc.id
                this.salesLS.push(item)
            })
            this.spinerService$.hide()
        }).catch(error => {
            this.spinerService$.hide()
        })
    }

    viewpdf(pdfURL: string) {
        window.open(`${pdfURL}`, '', 'width=800,height=1000,left=50,top=50,toolbar=no,location= no,directories=no');
    }


    manageSale(sale: sale) {
        let coins = 0
        Swal.fire({
            title: 'Confirmanos por favor',
            text: "Deseas aprobar o rechazar la compra de BambuCoins de " + sale.usuario + '?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aprobar',
            denyButtonText: 'Rechazar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Recargar BambuCoins a ' + sale.usuario,
                    text: "Cuantos BambuCoins recargaras en la cuenta de " + sale.usuario + '?',
                    input: 'number',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Recargar',
                    showLoaderOnConfirm: true,
                    preConfirm: (bambuCoins) => {
                        coins = Number(bambuCoins);
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.spinerService$.show()
                        this.salesService.filterCoinsUser(coins, sale.uidUsuario).then(res => {
                            this.salesService.updateSaleState('APROVADA', sale.id)
                            this.updateCoins$.update();
                            this.spinerService$.hide()
                        }).catch(error => {
                            this.updateCoins$.update();
                            this.spinerService$.hide()
                        })
                        Swal.fire({
                            title: `Perfecto!!`,
                            text: `Se han cargado los BambuCoins a la cuenta de ${sale.usuario}`
                        })
                    }
                })
            } if(result.isDenied) {
                this.salesService.updateSaleState('RECHAZADA', sale.id);
                this.listSales();
            }
        })

        //------------------------------------

    }

    convertDate(date) {
        const timestamp = Date.parse(date)
        return new Date(timestamp).toLocaleDateString("en-us")
    }

}
