import {Component, OnInit, ElementRef} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {LoginServiceService} from "../../infraestructure/services/login-service.service";
import {Router} from "@angular/router";
import {LoginResponse} from "./interfaces/login.interface";
import {SpinnerService} from "../services/spinner.service";
import {SalesService} from "../../components/admin-sales/services/sales.service";
import loop from "../../components/admin-loops/interfaces/loop.interface";
import {UpdateCoinsService} from "../services/updateCoins.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    isLogged = false;
    isAdmin = false;
    userData: LoginResponse;
    coins = 0;

    constructor(public location: Location,
                private element: ElementRef,
                private loginService$: LoginServiceService,
                private router: Router,
                private updateCoins$: UpdateCoinsService,
                private spinnerService$: SpinnerService) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.spinnerService$.show()
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.loginService$.isLogged().subscribe(res => {
            if (res == null) {
                this.isLogged = false;
            } else {
                this.isAdmin = res.uid == 'n1jt3kLfCfXcrixesDubqXUqy252'
                this.isLogged = true;
            }
            this.spinnerService$.hide()
        })
        this.userData = JSON.parse(sessionStorage.getItem('userData')) as LoginResponse
        this.updateCoins$.update()
        this.updateCoins$.coins$.subscribe(res => {
            this.coins = res
        })
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '/documentation') {
            return true;
        } else {
            return false;
        }
    }

    login() {
        this.spinnerService$.show()
        this.loginService$.login()
            .then((res: any) => {
                sessionStorage.setItem('userData', JSON.stringify(res))
                this.userData = res as LoginResponse
                this.isLogged = true;
                setTimeout(() => {
                    this.updateCoins$.update()
                }, 1000)

                this.loginService$.termsAccept().subscribe( usuarios => {
                    const exist = usuarios.find( usuario => this.userData.user.email === usuario.email)
                    if(!exist && this.isLogged){
                        Swal.fire({
                            text: 'Antes de continuar debes aceptar nuestros términos y condiciones',
                            imageUrl:'https://firebasestorage.googleapis.com/v0/b/bambucoloops-6d9bc.appspot.com/o/terminosCondiciones%2FTYC.jpg?alt=media&token=ca457160-2382-4fd6-ac78-e32c07054801',
                            showDenyButton: true,
                            confirmButtonText: 'Acepto',
                            denyButtonText: `No acepto`,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                this.loginService$.userAcceptTerms(this.userData.user.email).then( res => {
                                    Swal.fire('Genial, Bienvenido a BAMBUCOLOOPS!', '', 'success')
                                })

                            } else if (result.isDenied || result.dismiss) {
                                Swal.fire('lo sentimos, no puedes continuar si no aceptas los terminos', '', 'error').then( (result) => {
                                        this.loginService$.logout()
                                })
                            }
                        })
                    }
                })

                this.spinnerService$.hide()
            }).catch(error => {
            this.isLogged = false;
            console.log(error)
            this.spinnerService$.hide()
        })
    }

    logout() {
        this.spinnerService$.show()
        this.loginService$.logout().then(res => {
            this.isLogged = false;
            this.router.navigate(['/inicio'])
            this.spinnerService$.hide()
        })
            .catch(error => {
                console.log(error)
                this.spinnerService$.hide()
            })
    }
}
