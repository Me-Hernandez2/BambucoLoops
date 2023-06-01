import { Component, OnInit } from '@angular/core';
import loop from "../admin-loops/interfaces/loop.interface";
import {LibraryService} from "./services/library.service";
import {LoginResponse} from "../../shared/navbar/interfaces/login.interface";
import {SpinnerService} from "../../shared/services/spinner.service";
import {ProductInterface} from "./interfaces/product.interface";
import {LoopsService} from "../admin-loops/services/loops.service";
import {decrypt, encrypt} from "../../infraestructure/util/util-encrypt";
import {DomSanitizer} from "@angular/platform-browser";
import {LibsService} from "../admin-libs/services/libs.service";

@Component({
  selector: 'app-library-user',
  templateUrl: './library-user.component.html',
  styleUrls: ['./library-user.component.scss']
})
export class LibraryUserComponent implements OnInit {
  userData: LoginResponse;
  allLoopsLs: loop[] = [];
  allLibsLs: any[] = [];
  ownedLoopsLs: loop[] = [];
  ownedLibsLs: any[] = [];
  productsOwnedLs: ProductInterface[] = [];
  audioReproductor = new Audio();

  constructor( private libraryService$: LibraryService,
               private spinnerService$: SpinnerService,
               private loopsService$: LoopsService,
               private libsService$: LibsService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))  as LoginResponse;
    this.getLoops()
  }

    getLoops() {
        this.spinnerService$.show();
        this.loopsService$.getLoops().subscribe(res => {
            this.allLoopsLs = res
            this.spinnerService$.hide()
            this.getLibs()
        })
    }

    getLibs() {
        this.spinnerService$.show();
        this.libsService$.getLibs().subscribe(res => {
            this.allLibsLs = res
            this.spinnerService$.hide()
            this.getProductsOwned()
        })
    }

  getProductsOwned(){
      this.spinnerService$.show();
      this.libraryService$.getItems(this.userData.user.uid).then(
        res => {
          this.spinnerService$.hide()
          res.forEach((doc) => {
            this.productsOwnedLs.push(doc.data() as ProductInterface)
          })
            this.getFiles();
        }).catch(error => console.log(error));
  }

  getFiles(){
      this.ownedLibsLs = [];
      this.ownedLoopsLs = [];
      this.productsOwnedLs.forEach( product =>{
          if(product.typeProduct == 'LOOP'){
              this.ownedLoopsLs.push(this.allLoopsLs.filter( loop => loop.id == product.idProduct)[0])
              console.table('loops: '+ JSON.stringify(this.ownedLoopsLs))
          }else{
              this.ownedLibsLs.push(this.allLibsLs.filter( lib => lib.id == product.idProduct)[0])
          }
      })
  }

    fetchFile(url) {
                let tempUrl = URL.createObjectURL(url);
                const aTag = document.createElement("a");
                aTag.href = tempUrl;
                aTag.download = url.replace(/^.*[\\\/]/, '');
                document.body.appendChild(aTag);
                aTag.click();
                URL.revokeObjectURL(tempUrl);
                aTag.remove();



    }

    download(reference:string){
        return decrypt(reference)
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

}
