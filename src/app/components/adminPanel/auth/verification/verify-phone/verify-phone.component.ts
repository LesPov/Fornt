import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../services/adminService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-phone',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './verify-phone.component.html',
  styleUrl: './verify-phone.component.css'
})
export class VerifyPhoneComponent {
  phoneNumber: string = ''; // Almacena el número de teléfono ingresado
  username: string = ''; // Almacena el nombre de usuario
  verificationDigits: string[] = ['', '', '', '', '', '']; // Array para almacenar los dígitos del código de verificación
  showUsernameForm: boolean = true; // Controla la visibilidad del formulario de nombre de usuario
  showConfirmationMessage: boolean = false; // Controla la visibilidad del mensaje de confirmación
  timeLeft: number = 120; // Tiempo restante para la verificación en segundos (2 minutos)
  interval: any; // Almacena el intervalo del temporizador
  timerVisible: boolean = false; // Controla la visibilidad del temporizador

  constructor(
    private adminService: AdminService, // Servicio para interacciones con el backend
    private route: ActivatedRoute, // Para acceder a los parámetros de la ruta
    private toastr: ToastrService, // Servicio para mostrar mensajes de notificación
    private router: Router // Para navegar entre rutas
  ) { }

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el nombre de usuario y el número de teléfono
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.phoneNumber = params['phoneNumber'] ? params['phoneNumber'].replace(/\D/g, '') : ''; // Formatea el número quitando caracteres no numéricos
      if (this.username && this.phoneNumber) {
        this.showUsernameForm = false; // Oculta el formulario si ambos valores están presentes
      }
    });
    this.startTimer(); // Inicia el temporizador para la verificación
  }

  /**
   * Inicia el temporizador para la verificación.
   * Este temporizador cuenta regresivamente y actualiza la visibilidad del temporizador.
   */
  startTimer() {
    this.timerVisible = true; // Muestra el temporizador
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--; // Decrementa el tiempo restante
      } else {
        clearInterval(this.interval); // Detiene el temporizador cuando llega a cero
        this.timerVisible = false; // Oculta el temporizador
      }
    }, 1000); // Actualiza cada segundo
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Limpia el intervalo al destruir el componente
  }

  /**
   * Muestra el diálogo de confirmación para la verificación.
   */
  showConfirmationDialog() {
    this.showConfirmationMessage = true; // Muestra el mensaje de confirmación
  }

  /**
   * Maneja el evento de teclado al interactuar con los campos de entrada del código de verificación.
   * 
   * @param currentInput - El campo de entrada actual.
   * @param prevInput - El campo de entrada anterior (puede ser nulo).
   * @param nextInput - El siguiente campo de entrada (puede ser nulo).
   * @param event - El evento de teclado.
   */
  handleKeyUp(currentInput: HTMLInputElement, prevInput: HTMLInputElement | null, nextInput: HTMLInputElement | null, event: KeyboardEvent) {
    if (event.key === 'Backspace' && currentInput.value === '' && prevInput) {
      event.preventDefault(); // Previene el comportamiento por defecto del navegador
      prevInput.focus(); // Mueve el foco al campo anterior
    } else if (event.key !== 'Backspace' && nextInput && currentInput.value !== '') {
      event.preventDefault(); // Previene el comportamiento por defecto del navegador
      nextInput.focus(); // Mueve el foco al siguiente campo
    }

    // Si es el último input y tiene un valor, realiza la verificación
    if (!nextInput && currentInput.value !== '') {
      this.verifyCode(); // Llama a la función de verificación
    }
  }

  /**
   * Verifica el código de verificación ingresado por el usuario.
   * Si el código es válido, procede a verificar el número de teléfono.
   */
  verifyCode() {
    const fullCode = this.verificationDigits.join(''); // Junta los dígitos del código en una cadena

    if (!this.username || !this.phoneNumber || fullCode.length !== 6) {
      this.toastr.error('Por favor, ingresa el código de verificación completo.', 'Error'); // Muestra un error si los datos no son válidos
      return;
    }

    const formattedPhoneNumber = '+' + this.phoneNumber.replace(/\D/g, ''); // Formatea el número con el prefijo de código de país
    this.adminService.verifyPhoneNumber(this.username, formattedPhoneNumber, fullCode).subscribe(
      () => {
        this.toastr.success('Número de teléfono verificado con éxito.', 'Éxito'); // Muestra un mensaje de éxito
        this.showUsernameForm = false; // Oculta el formulario
        this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
      },
      (error: HttpErrorResponse) => {
        if (error.error.msg) {
          this.toastr.error(error.error.msg, 'Error'); // Muestra el mensaje de error devuelto por el servidor
        } else {
          this.toastr.error('Error al verificar el número de teléfono', 'Error'); // Mensaje de error genérico
        }
      }
    );
  }

  /**
   * Formatea el tiempo restante para mostrar en el temporizador.
   * 
   * @returns {string} - El tiempo restante en formato MM:SS.
   */
  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60); // Calcula los minutos
    const seconds = this.timeLeft % 60; // Calcula los segundos

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Retorna el tiempo formateado
  }

  /**
   * Reenvía el código de verificación al número de teléfono del usuario.
   * Reinicia el temporizador y muestra un mensaje de éxito.
   */
  resendVerificationCode() {
    this.adminService.resendVerificationPhone(this.username, this.phoneNumber).subscribe(
      () => {
        this.toastr.success('Se ha reenviado el código de verificación.', 'Éxito'); // Muestra mensaje de éxito
        this.timeLeft = 120; // Reinicia el temporizador
        this.startTimer(); // Inicia el temporizador nuevamente
        this.timerVisible = true; // Muestra el temporizador
      },
      error => {
        this.toastr.error('No se pudo reenviar el código de verificación. Inténtalo de nuevo.', 'Error'); // Mensaje de error
      }
    );
  }
}