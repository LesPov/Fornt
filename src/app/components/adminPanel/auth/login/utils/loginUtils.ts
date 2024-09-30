// src/app/utils/loginUtils.ts
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/**
 * Maneja el éxito del inicio de sesión.
 * @param response Respuesta de la API
 * @param user Usuario que intenta iniciar sesión
 * @param router Router para redireccionar
 * @param toastr ToastrService para mostrar mensajes de éxito
 */
export function handleLoginSuccess(response: any, user: any, router: Router, toastr: ToastrService) {
  if (response.token) {
    toastr.success(`Bienvenido, ${user.username}!`);

    // Almacenar token y userId en localStorage
    storeUserData(response.token, response.userId);

    // Redireccionar según el rol y condiciones
    setTimeout(() => redirectUser(response, router), 100);
  }
}

/**
 * Almacena el token y el userId en localStorage.
 * @param token Token de autenticación
 * @param userId ID del usuario (opcional)
 */
export function storeUserData(token: string, userId?: string) {
  localStorage.setItem('token', token);
  if (userId) {
    localStorage.setItem('userId', userId);
  }
}

/**
 * Redirecciona al usuario según el rol y otros parámetros.
 * @param response Respuesta de la API con la información del usuario
 * @param router Router para redireccionar
 */
export function redirectUser(response: any, router: Router) {
  if (response.rol === 'admin') {
    router.navigate(['/admin']);
  } else if (response.passwordorrandomPassword === 'randomPassword') {
    // router.navigate(['login/change-password'], { queryParams: { username: response.username } });
  } else {
    router.navigate(['/home']);
  }
}

/**
 * Maneja el error durante el inicio de sesión.
 * @param error Error de la solicitud HTTP
 * @param toastr ToastrService para mostrar mensajes de error
 */
export function handleLoginError(error: HttpErrorResponse, toastr: ToastrService) {
  const errorMessage = error.error?.msg || 'Hubo un error al iniciar sesión';
  toastr.error(errorMessage, 'Error');
}
