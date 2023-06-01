import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { LandingComponent } from './examples/landing/landing.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import {LoopsComponent} from "./components/loops/loops.component";

import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {LoginComponent} from "./components/login/login.component";
import {AdminInstrumentsComponent} from "./components/admin-instruments/admin-instruments.component";
import {AdminCategoriesComponent} from "./components/admin-categories/admin-categories.component";
import {AdminLibsComponent} from "./components/admin-libs/admin-libs.component";
import {AdminLoopsComponent} from "./components/admin-loops/admin-loops.component";
import {AdminSalesComponent} from "./components/admin-sales/admin-sales.component";
import {ReloadCreditsComponent} from "./components/reload-credits/reload-credits.component";
import {LibraryUserComponent} from "./components/library-user/library-user.component";
import {BookstoresComponent} from "./components/bookstores/bookstores.component";
import {AdminAuthorsComponent} from "./components/admin-authors/admin-authors.component";
import {AdminSaleAutorComponent} from "./components/admin-sale-autor/admin-sale-autor.component";

const routes: Routes =[
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio',                component: LandingComponent },
    { path: 'nucleoicons',          component: NucleoiconsComponent },
    { path: 'librerias',          component: BookstoresComponent },
    { path: 'loops',          component: LoopsComponent },
    { path: 'contacto',          component: NucleoiconsComponent },
    { path: 'examples/landing',     component: LandingComponent },
    { path: 'login',     component: LoginComponent },
    { path: 'examples/login',       component: LoginComponent },
    { path: 'examples/profile',     component: ProfileComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminIntrumentos',     component: AdminInstrumentsComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminCategorias',     component: AdminCategoriesComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminLibrerias',     component: AdminLibsComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminLoops',     component: AdminLoopsComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminVentas',     component: AdminSalesComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminVentasUsuario',     component: AdminSaleAutorComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'recargarCreditos',     component: ReloadCreditsComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'biblioteca',     component: LibraryUserComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
    { path: 'adminAutores',     component: AdminAuthorsComponent, ...canActivate(() => redirectUnauthorizedTo(['inicio']))},
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
