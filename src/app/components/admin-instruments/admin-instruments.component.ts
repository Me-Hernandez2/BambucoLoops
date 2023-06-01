import {Component, OnInit, PipeTransform} from '@angular/core';
import * as Rellax from 'rellax';
import {InstrumentsService} from "./services/instruments.service";
import instrument from "./interfaces/instrument.interface";
import {map, Observable, startWith} from "rxjs";
import {DecimalPipe} from "@angular/common";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-instruments',
  templateUrl: './admin-instruments.component.html',
  styleUrls: ['./admin-instruments.component.scss']
})
export class AdminInstrumentsComponent implements OnInit {
  focus;
  focus1;
  instrumentName = '';
  instrumentsLs: instrument[]=[]

  constructor( private instrumentsService$: InstrumentsService) {

  }

  ngOnInit() {
    var rellaxHeader = new Rellax('.rellax-header');

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    this.getInstruments();
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  getInstruments(){
    this.instrumentsService$.getInstruments().subscribe( res => {
      this.instrumentsLs = res
    })
  }

  async addInstrument(){
    const payload = {
      nombre: this.instrumentName
    }
    if(this.instrumentName != ''){
      const response = await this.instrumentsService$.addInstrument(payload);
      this.instrumentName = '';
    }else{
      alert('El nombre del instrumento no puede ir vacio')
    }
  }

  async deleteInstrument(instrument: instrument){
    const response = await this.instrumentsService$.deleteInstrument(instrument);
  }
}
