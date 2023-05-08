import {NgModule, RendererFactory2} from '@angular/core';
import {BrowserModule, ɵDomRendererFactory2} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './login/login.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BsModalService} from "ngx-bootstrap/modal";



@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent
  ],
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      HttpClientModule
    ],
  providers: [
    BsModalService,
    {
      provide: RendererFactory2,
      useClass: ɵDomRendererFactory2
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
