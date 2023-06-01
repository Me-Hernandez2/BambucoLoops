import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './examples/examples.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFireAuth, AngularFireAuthModule} from "@angular/fire/compat/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAuth, provideAuth} from "@angular/fire/auth";
import { FooterComponent } from './shared/footer/footer.component';
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import { SpinnerComponent } from './shared/spinner/spinner.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {spinnerInterceptor} from "./infraestructure/interceptors/spinner.interceptor";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        RouterModule,
        AppRoutingModule,
        ComponentsModule,
        ExamplesModule,
        CommonModule,

        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore())

    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: spinnerInterceptor, multi:true}
    ],
    exports: [
        SpinnerComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
