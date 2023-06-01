import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import loop from "./interfaces/loop.interface";
import {LoopsService} from "./services/loops.service";
import {getDownloadURL, ref, getStorage, uploadBytes, deleteObject} from "@angular/fire/storage";
import {decrypt, encrypt} from "../../infraestructure/util/util-encrypt";
import instrument from "../admin-instruments/interfaces/instrument.interface";
import {InstrumentsService} from "../admin-instruments/services/instruments.service";
import {SpinnerService} from "../../shared/services/spinner.service";
import {AuthorsService} from "../admin-authors/services/authors.service";
import {AutorInterface} from "../admin-authors/interfaces/autor.interface";

@Component({
  selector: 'app-admin-loops',
  templateUrl: './admin-loops.component.html',
  styleUrls: ['./admin-loops.component.scss']
})
export class AdminLoopsComponent implements OnInit {
  focus;
  focus1;
  formLoop!: FormGroup;
  imageToUpload: File | null = null;
  audioPreviewToUpload: File | null = null;
  audiofullToUpload: File | null = null;
  imageName = '';
  audioPrevName = '';
  audioFullName = '';
  audioPrevURL = '';
  audioFullURL = '';
  coverURL = '';
  audioReproductor = new Audio();
  instrumentsLs: instrument[] = [];
  instrumentSelected: instrument;
  authorsLs: AutorInterface[] = [];
  authorSelected: AutorInterface;


  loopsLs: loop[] = [];
  storage = getStorage();

  constructor( private fb: FormBuilder,
               private loopsService$:LoopsService,
               private instrumentsService$: InstrumentsService,
               private spinnerService$: SpinnerService,
               private authorService$: AuthorsService
               ) { }

  ngOnInit() {
    var rellaxHeader = new Rellax('.rellax-header');

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    this.initForm();
    this.getLoops();
    this.getAuthors();
    this.getInstruments();
    //decrypt('')) => FUNCION PARA DESENCRIPTAR
  }
  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    this.audioReproductor.pause();
  }

  initForm() {
    this.formLoop = this.fb.group({
      nombre: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      descripcion: [''],
      instrumento: [''],
      precio: [''],
      rememberMe: [false],
    });
  }

  getInstruments(){
    this.instrumentsService$.getInstruments().subscribe( res => {
      this.instrumentsLs = [...res]
    })
  }

  getAuthors(){
    this.authorService$.getAuthors().subscribe( res => {
      this.authorsLs = [...res]
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

  async addLoop(){

    const payload: loop = {
      nombre: this.formLoop.controls['nombre'].value,
      autor: this.authorSelected,
      descripcion: this.formLoop.controls['descripcion'].value,
      instrumento: this.instrumentSelected.nombre,
      precio: this.formLoop.controls['precio'].value,
      tipoProducto: 'LOOP',
      audioPreview: this.audioPrevURL,
      refAudioPreview: `audios/previews/${this.audioPreviewToUpload.name}`,
      audioVenta: encrypt(this.audioFullURL),
      refAudioVenta: `audios/full/${this.audiofullToUpload.name}`,
      cover: this.coverURL,
      refCover: `images/loops/${this.imageToUpload.name.slice(0, -4) + ' ' + this.formLoop.controls['nombre'].value}`,
    }
    const response = await this.loopsService$.addLoop(payload);
    this.spinnerService$.hide()
  }

  uploadImage(){
    this.spinnerService$.show();
    const imgRef = ref(this.storage, `images/loops/${this.imageToUpload.name.slice(0, -4) + ' ' + this.formLoop.controls['nombre'].value}`);
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

  getLoops(){
    this.spinnerService$.show();
    this.loopsService$.getLoops().subscribe( res => {
      this.loopsLs = res
      this.spinnerService$.hide()
    })
  }

  reproducir(resource:string, play) {
    this.audioReproductor.pause();
    if(play){
      this.audioReproductor= new Audio(resource);
      this.audioReproductor.play();
    }else{
      this.audioReproductor.pause();
      this.audioReproductor= new Audio();
    }
  }

  async deleteLoop(loop: loop){
    this.spinnerService$.show();
    const refCover = ref(this.storage, loop.refCover)
    const refAudioPreview = ref(this.storage, loop.refAudioPreview)
    const refAudioFull = ref(this.storage, loop.refAudioVenta)

    const responseDba = await this.loopsService$.deleteLoop(loop);
    const responseStorageCover = await deleteObject(refCover)
    const responseStoragePreview = await deleteObject(refAudioPreview)
    const responseStorageFull = await deleteObject(refAudioFull)
    this.spinnerService$.hide()
    console.log('resDBA: '+ responseDba +
                '/n resStorageCover: '+responseStorageCover+
                '/n resStoragePrev: '+responseStoragePreview+
                '/n resStorageFull: '+ responseStorageFull)
  }
}
