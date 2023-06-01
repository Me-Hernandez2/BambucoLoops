import {Component, HostListener, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import sale from "../admin-sales/interfaces/sales.interface";
import {LoginServiceService} from "../../infraestructure/services/login-service.service";
import reloadCredits from "./interfaces/reloadCredits.interface";
import {SalesService} from "../admin-sales/services/sales.service";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";
import {SpinnerService} from "../../shared/services/spinner.service";

@Component({
  selector: 'app-reload-credits',
  templateUrl: './reload-credits.component.html',
  styleUrls: ['./reload-credits.component.scss']
})
export class ReloadCreditsComponent implements OnInit {
  currentUser: any;
  storage = getStorage();
  pdfToUpload: File | null = null;
  pdfName = '';
  pdfURL=''
  constructor(private loginService$: LoginServiceService,
              private salesService$: SalesService,
              private spinnerService$: SpinnerService) { }

  ngOnInit(): void {
    this.loginService$.isLogged().subscribe(res => {
        this.currentUser = res;
    })
  }

    handlePdfInput(files: FileList) {
        this.pdfToUpload = files.item(0);
        this.pdfName = this.pdfToUpload.name;
        this.uploadPdf();
    }

  buyCredits() {
      const payload: reloadCredits = {
          usuario: this.currentUser.email,
          uidUsuario: this.currentUser.uid,
          comprobanteDePago: this.pdfURL,
          estado: 'PENDIENTE DE GESTION',
          fecha: Date.now(),
      }
      this.salesService$.addSale(payload).then(res => {
          Swal.fire({
                  title: 'Listo!',
                  text: 'Una vez se valide el pago, se te notificara la recarga de tus BambuCoins',
                  icon: 'success',
                  confirmButtonColor: '#f96332'
              }
          )
          this.spinnerService$.hide()
          this.pdfToUpload = null;
          this.pdfName = null;
          this.pdfURL = null;

      }).catch(error => {
          Swal.fire({
                  title: 'Oops!',
                  text: 'Algo sucedio con tu compra: ' + error,
                  icon: 'error',
                  confirmButtonColor: '#f96332'
              }
          )
          this.spinnerService$.hide();
          this.pdfToUpload = null;
          this.pdfName = null;
          this.pdfURL = null;
      })
    }


    uploadPdf(){
        this.spinnerService$.show();
        const imgRef = ref(this.storage, `images/comprobantes/${this.pdfToUpload.name.slice(0, -3) + Math.floor(Math.random() * 999999) + '.pdf'}`);
        uploadBytes(imgRef, this.pdfToUpload)
            .then( async response => {
                this.pdfURL =  await getDownloadURL(response.ref)
                this.buyCredits();
            })
            .catch(error => console.log(error));

    }
}
