import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../shared/services/spinner.service";
import {AuthorsService} from "../admin-authors/services/authors.service";
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";
import loop from "../admin-loops/interfaces/loop.interface";
import {encrypt} from "../../infraestructure/util/util-encrypt";
import {LibsService} from "./services/libs.service";
import {AutorInterface} from "../admin-authors/interfaces/autor.interface";
import LibInterface from "./interfaces/lib.interface";

@Component({
  selector: 'app-admin-libs',
  templateUrl: './admin-libs.component.html',
  styleUrls: ['./admin-libs.component.scss']
})
export class AdminLibsComponent implements OnInit {
  focus;
  focus1;
  formLibs!: FormGroup;
  imageToUpload: File | null = null;
  imageName = '';
  audioPreviewToUpload: File | null = null;
  audioPrevName = '';
  audiofullToUpload: File | null = null;
  audioFullName = '';
  audioPrevURL = '';
  audioFullURL = '';
  coverURL = '';
  authorsLs: AutorInterface[] = [];
  authorSelected: AutorInterface;
  libsLs : any[] = [];
  audioReproductor = new Audio();
  storage = getStorage();

  constructor(private fb: FormBuilder,
              private spinnerService$: SpinnerService,
              private authorService$: AuthorsService,
              private libsService$: LibsService) { }

  ngOnInit() {
    var rellaxHeader = new Rellax('.rellax-header');
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    this.initForm();
    this.getAuthors();
    this.getLibs()
  }

  initForm() {
    this.formLibs = this.fb.group({
      nombre: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      descripcion: [''],
      cantidadLoops: [''],
      precio: [''],
    });
  }

  getAuthors(){
    this.authorService$.getAuthors().subscribe( res => {
      this.authorsLs = [...res]
    })
  }

  getLibs() {
    this.spinnerService$.show();
    this.libsService$.getLibs().subscribe(res => {
      this.libsLs = res
      this.spinnerService$.hide()
    })
  }

  handleImageInput(files: FileList) {
    this.imageToUpload = files.item(0);
    this.imageName = this.imageToUpload.name;
  }

  handleAudioPrevInput(files: FileList) {
    this.audioPreviewToUpload = files.item(0);
    this.audioPrevName = this.audioPreviewToUpload.name;
  }

  handleAudioFullInput(files: FileList) {
    if(files.item(0).name.slice(-3) == 'rar'){
      this.audiofullToUpload = files.item(0);
      this.audioFullName = this.audiofullToUpload.name;
    }
  }

  uploadImage(){
    this.spinnerService$.show();
    const imgRef = ref(this.storage, `images/loops/${this.imageToUpload.name.slice(0, -4) + ' ' + this.formLibs.controls['nombre'].value}`);
    uploadBytes(imgRef, this.imageToUpload)
        .then( async response => {
          this.coverURL =  await getDownloadURL(response.ref)
          this.uploadAudioPrev()
        })
        .catch(error => console.log(error));

  }

  uploadAudioPrev(){
    const audioPrevRef = ref(this.storage, `audios/previews/${this.audioPreviewToUpload.name}`);
    uploadBytes(audioPrevRef, this.audioPreviewToUpload)
        .then(async response => {
          this.audioPrevURL= await getDownloadURL(response.ref)
          this.uploadAudioFull()
        })
        .catch(error => console.log(error));
  }

  uploadAudioFull(){
    const audioFullRef = ref(this.storage, `audios/full/${this.audiofullToUpload.name}`);
    uploadBytes(audioFullRef, this.audiofullToUpload)
        .then(async response => {
          this.audioFullURL= await getDownloadURL(response.ref)
          this.addLoop()
        })
        .catch(error => console.log(error));
  }

  async addLoop(){

    const payload: LibInterface = {
      nombre: this.formLibs.controls['nombre'].value,
      autor: this.authorSelected,
      descripcion: this.formLibs.controls['descripcion'].value,
      precio: this.formLibs.controls['precio'].value,
      cantidadLoops: this.formLibs.controls['cantidadLoops'].value,
      tipoProducto: 'LIBRERIA',
      audioPreview: this.audioPrevURL,
      refAudioPreview: `audios/previews/${this.audioPreviewToUpload.name}`,
      audioVenta: encrypt(this.audioFullURL),
      refAudioVenta: `audios/full/${this.audiofullToUpload.name}`,
      cover: this.coverURL,
      refCover: `images/loops/${this.imageToUpload.name.slice(0, -4) + ' ' + this.formLibs.controls['nombre'].value}`,
    }
    const response = await this.libsService$.addLib(payload);
    this.spinnerService$.hide()
  }

  async deleteLib(lib: LibInterface){
    this.spinnerService$.show();
    const refCover = ref(this.storage, lib.refCover)
    const refAudioPreview = ref(this.storage, lib.refAudioPreview)
    const refAudioFull = ref(this.storage, lib.refAudioVenta)

    const responseDba = await this.libsService$.deleteLibs(lib);
    const responseStorageCover = await deleteObject(refCover)
    const responseStoragePreview = await deleteObject(refAudioPreview)
    const responseStorageFull = await deleteObject(refAudioFull)
    this.spinnerService$.hide()
    console.log(lib)
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

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    this.audioReproductor.pause();
  }
}
