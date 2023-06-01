import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../shared/services/spinner.service";
import {AutorInterface} from "./interfaces/autor.interface";
import {AuthorsService} from "./services/authors.service";

@Component({
  selector: 'app-admin-authors',
  templateUrl: './admin-authors.component.html',
  styleUrls: ['./admin-authors.component.scss']
})
export class AdminAuthorsComponent implements OnInit {
  formAuthor!: FormGroup;
  authorsLs: AutorInterface[] = []

  constructor(private fb: FormBuilder,
              private spinnerService$: SpinnerService,
              private authorService$: AuthorsService) { }


  ngOnInit(): void {
    this.initForm();
    this.getAuthors();
  }

  initForm() {
    this.formAuthor = this.fb.group({
      nombre: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
    });
  }

  async addAuthor(){
    const payload: AutorInterface = {
      nombre: this.formAuthor.controls['nombre'].value,
      numeroDocumento: this.formAuthor.controls['numeroDocumento'].value
    }

    await this.authorService$.addAuthor(payload)
    this.getAuthors()
  }

  getAuthors(){
    this.authorService$.getAuthors().subscribe( res => {
      this.authorsLs = [...res]
    })
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

}
