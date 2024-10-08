import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminInterface } from '../interfaces/adminInterface';
import { LoginResponse } from '../interfaces/loginAdminInterface';

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio esté disponible en toda la aplicación.
})
export class AdminService {
  // URLs base de la aplicación y de la API
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    // Inicializa las URLs con las variables del entorno
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users/'; // Ruta para las operaciones de usuarios
  }

  /**
   * Registra un nuevo usuario.
   * @param {AdminInterface} user - Datos del usuario a registrar.
   * @returns {Observable<void>} - Observable que emite cuando el registro se completa.
   */
  register(user: AdminInterface): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}signup`, user);
  }

  /**
   * Verifica el correo electrónico del usuario.
   * @param {string} username - Nombre del usuario.
   * @param {string} verificationCode - Código de verificación.
   * @returns {Observable<any>} - Observable que emite la respuesta de la verificación.
   */
  verifyEmail(username: string, verificationCode: string): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}verify/email`, { username, verificationCode });
  }

  /**
   * Reenvía el código de verificación al correo electrónico del usuario.
   * @param {string} username - Nombre del usuario.
   * @returns {Observable<void>} - Observable que emite cuando el código se ha reenviado.
   */
  resendVerificationEmail(username: string): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}verify/email/resend`, { username });
  }

  /**
   * Registra el número de teléfono de un usuario.
   * @param {string} username - Nombre del usuario.
   * @param {string} phoneNumber - Número de teléfono.
   * @returns {Observable<void>} - Observable que emite cuando el número se registra.
   */
  registerPhoneNumber(username: string, phoneNumber: string): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}phone/send`, { username, phoneNumber });
  }

  /**
   * Obtiene la lista de países y sus códigos telefónicos.
   * @returns {Observable<any[]>} - Observable que emite la lista de países.
   */
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}${this.myApiUrl}countries`);
  }

  /**
   * Reenvía el código de verificación de teléfono.
   * @param {string} username - Nombre del usuario.
   * @returns {Observable<void>} - Observable que emite cuando el código es reenviado.
   */
  resendVerificationPhone(username: string, phoneNumber: string): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}verify/phone/resend`, { username, phoneNumber });
  }

  /**
   * Verifica el número de teléfono con un código de verificación.
   * @param {string} username - Nombre del usuario.
   * @param {string} phoneNumber - Número de teléfono.
   * @param {string} verificationCode - Código de verificación.
   * @returns {Observable<any>} - Observable que emite la respuesta de la verificación.
   */
  verifyPhoneNumber(username: string, phoneNumber: string, verificationCode: string): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}verify/phone`, { username, phoneNumber, verificationCode });
  }


  login(user: AdminInterface): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.myAppUrl}${this.myApiUrl}login`, user)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.userId) {
              localStorage.setItem('userId', response.userId);
            }
          }
        })
      );
  }

  requestPasswordReset(usernameOrEmail: string): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}forgotPassword`, { usernameOrEmail });
  }

  resetPassword(usernameOrEmail: string, randomPassword: string, newPassword: string, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}resetPassword`, { usernameOrEmail, randomPassword, newPassword }, { headers });
  }
  
}
