import { HttpClient, HttpParams } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable(
  {
    providedIn: "root"
  }
)
export class ApiService {

  set token(value: string) {
    this._token = value;
    this.saveTokenState();
  }
  get serverUrl(): string {
    return this._serverUrl;
  }

  set serverUrl(value: string) {
    this._serverUrl = value;
    this.saveUrlState();
    this.updateApiUrl()
  }
  get port(): number {
    return this._port;
  }

  set port(value: number) {
    this._port = value;
    this.savePortState();
    this.updateApiUrl()
  }

  private _token?: string;
  private _port: number = 8080;
  private _serverUrl: string = 'localhost';
  private apiUrl: string = `${this._serverUrl}:${this._port}`;
  constructor(private http: HttpClient) {
    this.loadState();
  }
  login(username: string): Observable<any> {
    const params = new HttpParams().set('username', username);
    const url = `${this.apiUrl}/login?${params.toString()}`;
    return this.http.post<any>(url, {'username':username});
  }

  logout(): Observable<any> {
    const params = new HttpParams().set('token', String(this._token));
    const url = `${this.apiUrl}/logout?${params.toString()}`;
    return this.http.delete<any>(url);
  }

  getMessages(): Observable<any> {
    const params = new HttpParams().set('token', String(this._token));
    const url = `${this.apiUrl}/message/list?${params.toString()}`;
    return this.http.get<any>(url);
  }

  postMessage(message: string): Observable<any> {
    const params = new HttpParams().set('token', String(this._token)).set('message', message);
    const url = `${this.apiUrl}/message?${params.toString()}`;
    return this.http.post<any>(url,{'token':String(this._token),'message':message});
  }

  getUsers(): Observable<any> {
    const params = new HttpParams().set('token', String(this._token));
    const url = `${this.apiUrl}/user/list?${params.toString()}`;
    return this.http.get<any>(url);
  }


  private loadState(): void {
    const token = sessionStorage.getItem(`apiService.token`);

    if (token) {
      this._token = token;
    }

    const port = sessionStorage.getItem(`apiService.port`);
    if (port) {
      this._port = +port;
    }

    const serverUrl = sessionStorage.getItem(`apiService.serverUrl`);
    if (serverUrl) {
      this._serverUrl = serverUrl;
    }
  }

  private saveTokenState(): void {
    sessionStorage.setItem(`apiService.token`, <string>this._token);
  }

  private savePortState() {
    sessionStorage.setItem(`apiService.port`, this._port.toString());
  }

  private saveUrlState() {
    sessionStorage.setItem(`apiService.serverUrl`, this._serverUrl);
  }

  private updateApiUrl(): void {
    this.apiUrl = `${this._serverUrl}:${this._port}`;
  }

  logoutPreviousSession() {
    if(this._token){
      firstValueFrom(this.logout())
        .then()
        .catch((error) => console.error(error));
    }
  }
}
