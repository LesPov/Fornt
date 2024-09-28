import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminInterface } from '../../interfaces/adminInterface';
import { AdminService } from '../../services/adminService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // Datos del usuario a ser logueado
  user: AdminInterface = {
    username: '',
    passwordorrandomPassword: '', // Cambiado para permitir el uso de contraseña o contraseña aleatoria
  };

  constructor(
    private toastr: ToastrService,
    private adminService: AdminService, // Servicio para la autenticación
    private router: Router
  ) { }

  ngOnInit(): void { }

  /**
   * Función principal que maneja el inicio de sesión del usuario.
   */
  loginUser() {
    this.adminService.login(this.user).subscribe(
      (response) => {
        this.handleLoginSuccess(response); // Manejamos el éxito del login
      },
      (error: HttpErrorResponse) => {
        this.handleLoginError(error); // Manejamos el error en caso de fallo
      }
    );
  }

  /**
   * Función para manejar el éxito del inicio de sesión.
   * @param response Respuesta de la API
   */
  private handleLoginSuccess(response: any) {
    if (response.token) {
      this.toastr.success(`Bienvenido, ${this.user.username}!`);
  
      // Almacenar token y userId en localStorage
      this.storeUserData(response.token, response.userId);
  
      // Redireccionar según el rol y condiciones, optimizando el uso de rutas para SEO.
      setTimeout(() => this.redirectUser(response), 100); // Agregamos un pequeño delay para mejorar el rendimiento del DOM.
    }
  }

  /**
   * Función para manejar el almacenamiento de datos en localStorage.
   * @param token Token de autenticación
   * @param userId ID del usuario
   */
  private storeUserData(token: string, userId?: string) {
    localStorage.setItem('token', token);
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }

  /**
   * Función para manejar la redirección del usuario según su rol y otros parámetros.
   * @param response Respuesta de la API con la información del usuario
   */
  private redirectUser(response: any) {
    if (response.rol === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      // Si el usuario tiene una contraseña aleatoria, lo redirigimos al cambio de contraseña
      if (response.passwordorrandomPassword === 'randomPassword') {
        // this.router.navigate(['login/change-password'], { queryParams: { username: this.user.username } });
      } else {
        // this.router.navigate(['/worker']);
      }
    }
  }

  /**
   * Función para manejar el error durante el inicio de sesión.
   * @param error Error de la solicitud HTTP
   */
  private handleLoginError(error: HttpErrorResponse) {
    const errorMessage = error.error?.msg || 'Hubo un error al iniciar sesión';
    this.toastr.error(errorMessage, 'Error');
  }
}
