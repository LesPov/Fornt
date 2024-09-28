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
  styleUrls: ['./register.component.css'] // Ruta al archivo CSS que contiene los estilos del componente
})
export class RegisterComponent {
  // Objeto que representa al usuario que se va a registrar
  user: AdminInterface = {
    username: '',
    password: '',
    email: '',
    rol: 'user',
    isVerified: false,
    isEmailVerified: false,
    verificationCode: '',
    isPhoneVerified: false,
    phoneNumber: ''
  };

  confirmPassword: string = ''; // Variable para confirmar la contraseña ingresada

  /**
   * Constructor del componente.
   */
  constructor(
    private toastr: ToastrService, // Servicio para mostrar notificaciones
    private adminService: AdminService, // Servicio para registrar al usuario
    private router: Router // Servicio de enrutamiento para navegación
  ) { }

  /**
   * Función que maneja el registro del usuario.
   */
  registerUser() {
    if (!this.isPasswordValid()) return; // Validamos las contraseñas

    this.adminService.register(this.user).subscribe(
      () => this.handleSuccess(), // Manejo del éxito
      (error: HttpErrorResponse) => this.handleError(error) // Manejo del error
    );
  }

  /**
   * Verifica si la contraseña y la confirmación coinciden.
   * @returns {boolean} - true si las contraseñas son válidas, false en caso contrario.
   */
  private isPasswordValid(): boolean {
    if (this.user.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return false; // Termina la ejecución si las contraseñas no coinciden
    }
    return true; // Las contraseñas son válidas
  }

  /**
   * Maneja el registro exitoso del usuario.
   */
  private handleSuccess() {
    this.toastr.success(`El usuario ${this.user.username} ha sido registrado con éxito`);
    this.router.navigate(['/verificacionEmail'], { queryParams: { username: this.user.username } });
  }

  /**
   * Maneja el error durante el registro del usuario.
   * @param error - Error de la solicitud HTTP
   */
  private handleError(error: HttpErrorResponse) {
    this.toastr.error(error.error.msg || 'Hubo un error al registrar el usuario', 'Error');
  }
}
