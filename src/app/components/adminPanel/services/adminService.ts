import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminInterface } from '../interfaces/adminInterface';

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio esté disponible en toda la aplicación sin tener que declararlo manualmente en otros módulos.
})
export class AdminService {

  // Definición de las URLs base de la aplicación y API
  private myAppUrl: string; // URL base de la aplicación obtenida desde el archivo de configuración del entorno
  private myApiUrl: string; // URL de la API específica para el registro de usuarios

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Servicio inyectado para hacer peticiones HTTP.
   */
  constructor(private http: HttpClient) {
    // Inicializa las URLs utilizando las variables del entorno
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users/'; // Define el endpoint específico para usuarios
  }

  /**
   * Realiza el registro de un nuevo usuario administrador.
   * 
   * @param {AdminInterface} user - Objeto que contiene los datos del usuario a registrar.
   * @returns {Observable<void>} - Un Observable que emitirá cuando la operación haya sido completada.
   */
  register(user: AdminInterface): Observable<void> {
    // Envía una petición POST al endpoint de registro con los datos del usuario
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}signup`, user);
  }
}
