import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminInterface } from '../../../interfaces/adminInterface';

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
    setTimeout(() => redirectUser(user,response, router), 100);
  }
}

/**
 * Redirecciona al usuario según el rol y otros parámetros.
 * @param response Respuesta de la API con la información del usuario
 * @param router Router para redireccionar
 */
export function redirectUser(user: AdminInterface,response: any, router: Router) {
  // Verificar si el usuario tiene una contraseña aleatoria
  if (response.passwordorrandomPassword === 'randomPassword') {
    // Redirigir a la página de cambio de contraseña con el username en query params
    router.navigate(['/loginChange'], { queryParams: { username: user.username } });
  }
  // Verificar si el rol es admin y no tiene una contraseña aleatoria
  else if (response.rol === 'admin') {
    router.navigate(['/admin']);
  }
  // Redirigir a la home si es un usuario normal con una contraseña no aleatoria
  else {
    router.navigate(['/home']);
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
 * Maneja el error durante el inicio de sesión.
 * @param error Error de la solicitud HTTP
 * @param toastr ToastrService para mostrar mensajes de error
 */
export function handleLoginError(error: HttpErrorResponse, toastr: ToastrService) {
  const errorMessage = error.error.msg || 'Hubo un error al iniciar sesión';
  toastr.error(errorMessage, 'Error');
}
