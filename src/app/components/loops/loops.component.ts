import {Component, OnInit} from '@angular/core';
import * as Rellax from 'rellax';
import instrument from "../admin-instruments/interfaces/instrument.interface";
import {InstrumentsService} from "../admin-instruments/services/instruments.service";
import {LoopsService} from "../admin-loops/services/loops.service";
import loop from "../admin-loops/interfaces/loop.interface";
import {SpinnerService} from "../../shared/services/spinner.service";
import Swal from 'sweetalert2'
import {SalesService} from "../admin-sales/services/sales.service";
import {LoginServiceService} from "../../infraestructure/services/login-service.service";
import sale from "../admin-sales/interfaces/sales.interface";
import {UpdateCoinsService} from "../../shared/services/updateCoins.service";
import {LibraryService} from "../library-user/services/library.service";
import {ProductInterface} from "../library-user/interfaces/product.interface";
import {AuthorSalesInterface} from "../reload-credits/interfaces/authorSales.interface";

@Component({
    selector: 'app-loops',
    templateUrl: './loops.component.html',
    styleUrls: ['./loops.component.scss']
})
export class LoopsComponent implements OnInit {

    data: Date = new Date();
    focus;
    focus1;
    instrumentsLs: instrument[] = []
    instrumentSelected: instrument;
    loopsLs: loop[] = [];
    audioReproductor = new Audio();
    isLogged = false;
    currentUser: any;
    fechaActual = new Date();

    constructor(private instrumentsService$: InstrumentsService,
                private loopsService$: LoopsService,
                private spinnerService$: SpinnerService,
                private salesService$: SalesService,
                private updateCoins$: UpdateCoinsService,
                private loginService$: LoginServiceService,
                private libraryService$: LibraryService) {
    }

    ngOnInit(): void {
        var rellaxHeader = new Rellax('.rellax-header');

        var body = document.getElementsByTagName('body')[0];
        body.classList.add('landing-page');
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
        this.loginService$.isLogged().subscribe(res => {
            if (res == null) {
                this.isLogged = false
            } else {
                this.currentUser = res;
                this.isLogged = true;
            }
        })
        this.getInstruments();
        this.getLoops();
    }

    getInstruments() {
        this.instrumentsService$.getInstruments().subscribe(res => {
            this.instrumentsLs = [...res]
        })
    }

    getLoops() {
        this.spinnerService$.show();
        this.loopsService$.getLoops().subscribe(res => {
            this.loopsLs = res
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

    async changeInstrument(instrument: instrument) {
        this.spinnerService$.show();
        this.instrumentSelected = instrument
        this.loopsLs = []
        this.loopsService$.filterByInstrument(this.instrumentSelected.nombre).then(
            res => {
                this.spinnerService$.hide()
                res.forEach((doc) => {
                    this.loopsLs.push(doc.data() as loop)
                })
            }
        ).catch(error => console.log(error));
    }

    buyProduct(loop: loop) {
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
                text: "No esta de mas una confirmacion antes de comprar no? Deseas comprar " + loop.nombre + '?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.salesService$.getCredits(this.currentUser.uid).then(     //CONSULTAMOS EL SALDO DEL USUARIO
                        res => {
                            res.forEach((doc) => {
                                const coinsUser = doc.data()
                                if (coinsUser.coins > loop.precio) {//VALIDAMOS QUE EL USUARIO TENGA SALDO SUFICIENTE
                                    this.libraryService$.getItems(this.currentUser.uid).then(
                                        res => {
                                            let libraryUser = []
                                            res.forEach((item) => {
                                                libraryUser.push(item.data())
                                            })
                                            if (libraryUser.find(item => item.idProduct === loop.id)) {
                                                Swal.fire({
                                                    title: 'Hey calma!',
                                                    text: 'Al parecer ya tienes este producto',
                                                    icon: 'warning',
                                                    confirmButtonColor: '#f96332'
                                                })
                                            } else { //VALIDAMOS QUE EL USUARIO NO TENGA YA COMPRADO ESTE ITEM
                                                const payload: ProductInterface = {
                                                    uid: this.currentUser.uid,
                                                    idProduct: loop.id,
                                                    typeProduct: loop.tipoProducto,
                                                }
                                                this.libraryService$.addItem(payload).then(res => { //AGREGAMOS EL ITEM A LA BIBLIOTECA
                                                    const newCoins = coinsUser.coins - Number(loop.precio)
                                                    this.salesService$.updateCoinsUser(newCoins, doc.id).then(
                                                        res => {                                    // COBRAMOS EL ITEM
                                                            this.updateCoins$.update()
                                                            const payload: AuthorSalesInterface = {
                                                                autor: loop.autor,
                                                                estado: true,
                                                                fecha: Date.now(),
                                                                producto: {
                                                                    nombreProducto: loop.nombre,
                                                                    precio: Number(loop.precio),
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
                                        }
                                    )

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
