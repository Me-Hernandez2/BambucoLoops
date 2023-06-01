import {Component, OnInit} from '@angular/core';
import instrument from "../admin-instruments/interfaces/instrument.interface";
import loop from "../admin-loops/interfaces/loop.interface";
import {InstrumentsService} from "../admin-instruments/services/instruments.service";
import {SpinnerService} from "../../shared/services/spinner.service";
import {LibsService} from "../admin-libs/services/libs.service";
import Swal from "sweetalert2";
import {ProductInterface} from "../library-user/interfaces/product.interface";
import {AuthorSalesInterface} from "../reload-credits/interfaces/authorSales.interface";
import {LoginServiceService} from "../../infraestructure/services/login-service.service";
import {SalesService} from "../admin-sales/services/sales.service";
import {LibraryService} from "../library-user/services/library.service";
import {UpdateCoinsService} from "../../shared/services/updateCoins.service";

@Component({
    selector: 'app-bookstores',
    templateUrl: './bookstores.component.html',
    styleUrls: ['./bookstores.component.scss']
})
export class BookstoresComponent implements OnInit {
    instrumentsLs: instrument[] = []
    instrumentSelected: instrument;
    libsLs: any[] = []
    audioReproductor = new Audio();
    isLogged = false;
    currentUser: any;

    constructor(private instrumentsService$: InstrumentsService,
                private spinnerService$: SpinnerService,
                private libsService$: LibsService,
                private loginService$: LoginServiceService,
                private salesService$: SalesService,
                private libraryService$: LibraryService,
                private updateCoins$: UpdateCoinsService,) {
    }

    ngOnInit(): void {
        this.loginService$.isLogged().subscribe(res => {
            if (res == null) {
                this.isLogged = false
            } else {
                this.currentUser = res;
                this.isLogged = true;
            }
        })
        this.getLibs()
    }

    getLibs() {
        this.spinnerService$.show();
        this.libsService$.getLibs().subscribe(res => {
            this.libsLs = res
            this.spinnerService$.hide()
        })
    }

    reproducir(resource: string, play) {
        this.audioReproductor.pause();
        if (play) {
            this.audioReproductor = new Audio(resource);
            this.audioReproductor.play();
        } else {
            this.audioReproductor.pause();
            this.audioReproductor = new Audio();
        }
    }

    buyProduct(lib: any) {
        if (!this.isLogged) {
            Swal.fire({
                title: 'deseas comprar?',
                text: "Para poder realizar compras debes tener una cuenta con nosotros, deseas crear una o iniciar sesion? es super facil, solo con clicks y sin llenar formularios aburridos",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'Neh, tal vez despues'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.loginService$.login();
                }
            })
        } else {
            Swal.fire({
                title: 'Confirmanos por favor',
                text: "No esta de mas una confirmacion antes de comprar no? Deseas comprar " + lib.nombre + '?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.salesService$.getCredits(this.currentUser.uid).then( //VALIDAMOS QUE EL USUARIO TENGA SALDO
                        res => {
                            res.forEach((doc) => {
                                const coinsUser = doc.data()
                                if (coinsUser.coins > lib.precio) { //VALIDAMOS QUE EL USUARIO TENGA SALDO SUFICIENTE
                                    this.libraryService$.getItems(this.currentUser.uid).then(
                                        res => {
                                            let libraryUser = []
                                            res.forEach((item) => {
                                                libraryUser.push(item.data())
                                            })
                                            if (libraryUser.find(item => item.idProduct === lib.id)) {
                                                Swal.fire({
                                                    title: 'Hey calma!',
                                                    text: 'Al parecer ya tienes este producto',
                                                    icon: 'warning',
                                                    confirmButtonColor: '#f96332'
                                                })
                                            } else { //VALIDAMOS QUE EL USUARIO NO TENGA YA COMPRADO ESTE ITEM
                                                const payload: ProductInterface = {
                                                    uid: this.currentUser.uid,
                                                    idProduct: lib.id,
                                                    typeProduct: lib.tipoProducto,
                                                }
                                                this.libraryService$.addItem(payload).then(res => { //AGREGAMOS EL ITEM A LA BIBLIOTECA
                                                    const newCoins = coinsUser.coins - Number(lib.precio)
                                                    this.salesService$.updateCoinsUser(newCoins, doc.id).then(
                                                        res => {                                    // COBRAMOS EL ITEM
                                                            this.updateCoins$.update()
                                                            const payload: AuthorSalesInterface = {
                                                                autor: lib.autor,
                                                                estado: true,
                                                                fecha: Date.now(),
                                                                producto: {
                                                                    nombreProducto: lib.nombre,
                                                                    precio: Number(lib.precio),
                                                                }
                                                            }
                                                            this.salesService$.addSaleAuthor(payload).then(res => { //ASOCIAMOS LA VENTA AL AUTOR
                                                                Swal.fire({
                                                                        title: 'Listo!',
                                                                        text: 'Ahora tu compra te esta esperando en tu biblioteca, Disfrutala!',
                                                                        icon: 'success',
                                                                        confirmButtonColor: '#f96332'
                                                                    }
                                                                )
                                                            })
                                                        }
                                                    )
                                                })
                                            }
                                        })
                                } else {
                                    Swal.fire({
                                        title: 'Oops!',
                                        text: 'No tienes suficientes BambuCoins, por favor recarga tu cuenta e intenta nuevamente',
                                        icon: 'error',
                                        confirmButtonColor: '#f96332'
                                    })
                                }
                            })
                            if (res.docs.length == 0) {
                                Swal.fire({
                                    title: 'Oops!',
                                    text: 'No tienes suficientes BambuCoins, por favor recarga tu cuenta e intenta nuevamente',
                                    icon: 'error',
                                    confirmButtonColor: '#f96332'
                                })
                            }
                        }
                    ).catch(error => console.error(error));
                }
            })
        }


    }

    ngOnDestroy() {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('landing-page');
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
        this.audioReproductor.pause();
    }



}
