import { Component } from '@angular/core'; // Decorador para definir un componente en Angular
import { AdminInterface } from '../../interfaces/adminInterface'; // Interfaz que define la estructura del usuario administrador
import { FormsModule } from '@angular/forms'; // Módulo necesario para trabajar con formularios en Angular
import { Router, RouterLink } from '@angular/router'; // Servicio de enrutamiento para navegar entre vistas
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones al usuario
import { AdminService } from '../../services/adminService'; // Servicio que se encarga de registrar al usuario en el backend
import { HttpErrorResponse } from '@angular/common/http'; // Clase que maneja errores en las solicitudes HTTP
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register', // Selector que identifica este componente en las plantillas HTML
  standalone: true, // Esto indica que este componente es independiente y no depende de otros módulos
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './register.component.html', // Ruta al archivo HTML que define la vista del componente
  styleUrl: './register.component.css' // Ruta al archivo CSS que contiene los estilos del componente
})
export class RegisterComponent {

  // Objeto que representa al usuario que se va a registrar, usando la interfaz AdminInterface
  user: AdminInterface = {
    username: '', // El nombre de usuario será completado por el usuario
    password: '', // La contraseña será completada por el usuario
    email: '', // El email será completado por el usuario
    rol: 'user', // Se define un rol predeterminado 'user' para los nuevos registros
    isVerified: false, // El usuario no está verificado por defecto
    isEmailVerified: false, // El email no está verificado por defecto
    verificationCode: '', // Código de verificación vacío
    isPhoneVerified: false, // El número de teléfono no está verificado por defecto
    phoneNumber: '' // El número de teléfono será proporcionado por el usuario, opcionalmente
  };

  // Variable para confirmar la contraseña ingresada
  confirmPassword: string = '';

  /**
   * Constructor del componente.
   * 
   * @param {ToastrService} toastr - Servicio inyectado para mostrar notificaciones emergentes al usuario.
   * @param {AdminService} adminService - Servicio que realiza las peticiones al backend para registrar al usuario.
   * @param {Router} router - Servicio de enrutamiento para redirigir al usuario después de un registro exitoso.
   */
  constructor(
    private toastr: ToastrService, // Inyección del servicio Toastr para mostrar mensajes al usuario
    private adminService: AdminService, // Inyección del servicio AdminService para registrar al usuario
    private router: Router // Inyección del servicio Router para manejar la navegación
  ) { }

  /**
   * Función que maneja el registro del usuario.
   * 
   * Realiza las siguientes acciones:
   * - Valida que la contraseña y la confirmación coincidan.
   * - Si coinciden, llama al servicio de `AdminService` para registrar al usuario.
   * - Muestra notificaciones de éxito o error según el resultado de la operación.
   */
  registerUser() {
    // Validamos que las contraseñas coincidan
    if (this.user.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error'); // Muestra un mensaje de error si las contraseñas no coinciden
      return; // Termina la ejecución si las contraseñas no coinciden
    }

    // Llamamos al servicio de registro para registrar al usuario
    this.adminService.register(this.user).subscribe(
      () => {
        // En caso de éxito, se muestra un mensaje de éxito y se redirige al usuario
        this.toastr.success(`El usuario ${this.user.username} ha sido registrado con éxito`);
        this.router.navigate(['/verificacionEmail'], { queryParams: { username: this.user.username } }); // Navegamos a la ruta de confirmación de email
      },
      (error: HttpErrorResponse) => {
        // En caso de error, mostramos un mensaje de error utilizando Toastr
        this.toastr.error(error.error.msg || 'Hubo un error al registrar el usuario', 'Error');
      }
    );
  }
}
