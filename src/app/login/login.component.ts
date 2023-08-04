import {Component, ElementRef, Injectable, ViewChild} from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {fromEvent} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable(

)
export class LoginComponent {

  serverUrlControl = new FormControl('localhost', [Validators.required]);
  portControl = new FormControl(
    '8080', [Validators.required, Validators.min(0),
    Validators.max(65535)]);
  usernameControl = new FormControl('Ivan',[Validators.required]);

  constructor(private http: HttpClient,private router: Router,private apiService: ApiService) {
    this.serverUrlControl.setValue(apiService.serverUrl);
    this.portControl.setValue(apiService.port.toString());
  }

  @ViewChild('loginBtn') loginBtn!: ElementRef;

  ngAfterViewInit() {
    const self = this;
    fromEvent(this.loginBtn.nativeElement, 'click').subscribe({
      next() {
        const serverUrl = String(self.serverUrlControl.value);
        const port = Number(self.portControl.value);
        const username = String(self.usernameControl.value);

        self.apiService.logoutPreviousSession();
        self.apiService.serverUrl = serverUrl;
        self.apiService.port= port;
        self.apiService.login(username).subscribe({
          next(uuid) {
            self.apiService.token = uuid;
            self.router.navigate(['/chat',
              {  username: username}
            ]).then();
          },
          error(error) {
            console.log('Error login', error);
          }
        });
      },
      error() {
        console.log('Error btn')
      }
    });
  }
}
