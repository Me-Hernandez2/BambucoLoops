import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';

import { BasicelementsComponent } from './basicelements/basicelements.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TypographyComponent } from './typography/typography.component';
import { NucleoiconsComponent } from './nucleoicons/nucleoicons.component';
import { ComponentsComponent } from './components.component';
import { NotificationComponent } from './notification/notification.component';
import { NgbdModalBasic } from './modal/modal.component';
import { LoopsComponent } from './loops/loops.component';
import { LoginComponent } from './login/login.component';
import { AdminInstrumentsComponent } from './admin-instruments/admin-instruments.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminLibsComponent } from './admin-libs/admin-libs.component';
import { AdminLoopsComponent } from './admin-loops/admin-loops.component';
import { AdminSalesComponent } from './admin-sales/admin-sales.component';
import { ReloadCreditsComponent } from './reload-credits/reload-credits.component';
import { LibraryUserComponent } from './library-user/library-user.component';
import { AdminAuthorsComponent } from './admin-authors/admin-authors.component';
import { BookstoresComponent } from './bookstores/bookstores.component';
import { AdminSaleAutorComponent } from './admin-sale-autor/admin-sale-autor.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        RouterModule,
        JwBootstrapSwitchNg2Module,
        ReactiveFormsModule,
    ],
    declarations: [
        ComponentsComponent,
        BasicelementsComponent,
        NavigationComponent,
        TypographyComponent,
        NucleoiconsComponent,
        NotificationComponent,
        NgbdModalBasic,
        LoopsComponent,
        LoginComponent,
        AdminInstrumentsComponent,
        AdminCategoriesComponent,
        AdminLibsComponent,
        AdminLoopsComponent,
        AdminSalesComponent,
        ReloadCreditsComponent,
        LibraryUserComponent,
        AdminAuthorsComponent,
        BookstoresComponent,
        AdminSaleAutorComponent,

    ],
    exports:[ ComponentsComponent ]
})
export class ComponentsModule { }
