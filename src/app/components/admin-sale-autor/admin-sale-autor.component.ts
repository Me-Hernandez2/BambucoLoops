import {Component, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SalesAutorService} from "./services/sales-autor.service";
import {SalesAutorInterface} from "./interfaces/salesAutor.interface";
import {SpinnerService} from "../../shared/services/spinner.service";
import {async} from "rxjs";

@Component({
    selector: 'app-admin-sale-autor',
    templateUrl: './admin-sale-autor.component.html',
    styleUrls: ['./admin-sale-autor.component.scss']
})
export class AdminSaleAutorComponent implements OnInit {
    @ViewChild('tablaReporte') reporte;
    salesAutorLS: SalesAutorInterface[] = [];
    totalVentas = 0;
    numeroDocumento = '';
    stateLs = [
        {nombre: 'Pendiente de pago', value: true},
        {nombre: 'Pagada', value: false},
    ];
    stateSelected = this.stateLs[0];
    fechaActual = Date.now();
    imprimiendo = false;

    constructor(private salesAutorService$: SalesAutorService,
                private spinerService$: SpinnerService) {
    }

    ngOnInit(): void {

    }


    getSalesAutor() {
        this.totalVentas = 0
        this.salesAutorService$.getLSalesAutor().subscribe(res => {
            this.salesAutorLS = res;
            this.salesAutorLS.forEach(sale => {
                this.totalVentas += sale.producto.precio;
            })
        })
    }

    changesState( state: any){
        if (this.stateSelected != state){
            this.stateSelected = state;
            this.salesAutorLS = [];
        }
    }

    filterSalesAutor() {
        this.spinerService$.show()
        this.salesAutorService$.filterByUser(this.numeroDocumento, this.stateSelected.value).then(
            res => {
                this.salesAutorLS = [];
                this.spinerService$.hide();
                this.totalVentas = 0;

                res.forEach((doc) => {
                    let item = doc.data() as SalesAutorInterface
                    item.id = doc.id
                    this.salesAutorLS.push(item)
                })
                console.table(this.salesAutorLS)

                this.salesAutorLS.forEach(sale => {
                    this.totalVentas += sale.producto.precio;
                })
                if (res.docs.length == 0) {
                    this.salesAutorLS = [];
                }
            }
        ).catch(error => console.error(error));
    }

    paySales() {
        this.salesAutorLS.forEach(async sale => {
            await this.salesAutorService$.updateSalesAutor(false, sale.id)
        })
        this.filterSalesAutor();
        this.imprimirElemento();
    }

    imprimirElemento() {
        this.imprimiendo = true;
        setTimeout(() => {
                let elemento = this.reporte.nativeElement; // este es el elemento viewChild
                let ventanaimprimir = window.open(
                    ' ', 'imprimir', "height=800,width=800,left=300,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,top=300"
                );
                ventanaimprimir.document.write(elemento.innerHTML);
                ventanaimprimir.document.close();
                ventanaimprimir.print();
                ventanaimprimir.close();
                this.imprimiendo = false;
            }, 100
        )
    }


}
