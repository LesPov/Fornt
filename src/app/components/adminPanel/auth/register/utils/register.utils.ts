import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones
import { Router } from '@angular/router'; // Servicio de enrutamiento para navegar entre vistas
import { HttpErrorResponse } from '@angular/common/http'; // Clase que maneja errores en las solicitudes HTTP
import { AdminInterface } from '../../../interfaces/adminInterface';

/**
 * Verifica si la contraseña y la confirmación coinciden.
 * @param user - El objeto usuario
 * @param confirmPassword - La confirmación de la contraseña
 * @param toastr - Servicio para mostrar mensajes de error si las contraseñas no coinciden
 * @returns {boolean} - true si las contraseñas son válidas, false en caso contrario.
 */
export function isPasswordValid(user: AdminInterface, confirmPassword: string, toastr: ToastrService): boolean {
  if (user.password !== confirmPassword) {
    toastr.error('Las contraseñas no coinciden', 'Error');
    return false;
  }
  return true;
}

/**
 * Maneja el registro exitoso del usuario.
 * @param user - El objeto usuario que se registró
 * @param toastr - Servicio para mostrar el mensaje de éxito
 * @param router - Servicio para redirigir a la página de verificación de email
 */
export function handleSuccess(user: AdminInterface, toastr: ToastrService, router: Router) {
  toastr.success(`El usuario ${user.username} ha sido registrado con éxito`);
  router.navigate(['/verificacionEmail'], { queryParams: { username: user.username } });
}

/**
 * Maneja el error durante el registro del usuario.
 * @param error - Error de la solicitud HTTP
 * @param toastr - Servicio para mostrar el mensaje de error
 */
export function handleError(error: HttpErrorResponse, toastr: ToastrService) {
  toastr.error(error.error.msg || 'Hubo un error al registrar el usuario', 'Error');
}
