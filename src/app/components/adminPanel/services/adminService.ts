import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminInterface } from '../interfaces/adminInterface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/auth/'; 
  }

  register(user: AdminInterface): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}register`, user);
  }

  
}
 