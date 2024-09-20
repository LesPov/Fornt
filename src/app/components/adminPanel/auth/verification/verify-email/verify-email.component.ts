import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../services/adminService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email', // Selector del componente
  standalone: true, // Define que este componente puede ser usado de manera independiente
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './verify-email.component.html', // Ruta del archivo HTML del componente
  styleUrl: './verify-email.component.css' // Ruta del archivo CSS del componente
})
export class VerifyEmailComponent implements OnInit {
  // Variables que se usan en el componente
  username: string = ''; // Almacena el nombre de usuario extraído de los queryParams
  verificationDigits: string[] = ['', '', '', '', '', '']; // Almacena los 6 dígitos del código de verificación
  showUsernameForm: boolean = true; // Controla la visibilidad del formulario de nombre de usuario
  showConfirmationMessage: boolean = false; // Controla si se muestra el mensaje de confirmación
  timeLeft: number = 120; // Tiempo restante en segundos para el temporizador (120 segundos = 2 minutos)
  interval: any; // Almacena el intervalo del temporizador
  timerVisible: boolean = false; // Controla si el temporizador es visible

  constructor(
    private adminService: AdminService, // Servicio para las interacciones con el backend
    private route: ActivatedRoute, // Servicio para obtener los parámetros de la ruta actual
    private toastr: ToastrService, // Servicio para mostrar notificaciones Toastr
    private router: Router // Servicio de navegación para redirigir a otras rutas
  ) {}

  /**
   * Se ejecuta al inicializar el componente. Obtiene el nombre de usuario de los queryParams
   * y si existe, oculta el formulario de nombre de usuario. Además, inicia el temporizador.
   */
  ngOnInit(): void {
    // Extrae el nombre de usuario de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.showUsernameForm = false; // Oculta el formulario si el nombre de usuario ya está presente
      }
    });
    this.startTimer(); // Inicia el temporizador
  }

  /**
   * Inicia un temporizador que cuenta hacia atrás desde el valor de `timeLeft` en segundos.
   * Cuando llega a cero, oculta el temporizador.
   */
  startTimer() {
    this.timerVisible = true; // Hace visible el temporizador
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--; // Resta 1 segundo por cada iteración
      } else {
        clearInterval(this.interval); // Detiene el temporizador cuando llega a 0
        this.timerVisible = false; // Oculta el temporizador
      }
    }, 1000); // Ejecuta el código cada 1 segundo
  }

  /**
   * Detiene el temporizador cuando se destruye el componente.
   */
  ngOnDestroy() {
    clearInterval(this.interval); // Limpia el intervalo para evitar fugas de memoria
  }

  /**
   * Muestra un diálogo de confirmación cuando el código de verificación es ingresado correctamente.
   */
  showConfirmationDialog() {
    this.showConfirmationMessage = true; // Muestra el mensaje de confirmación
  }

  /**
   * Maneja los eventos del teclado para los campos de entrada de los dígitos del código de verificación.
   * Permite moverse automáticamente entre los campos al ingresar o borrar valores.
   * 
   * @param currentInput - El campo de entrada actual
   * @param prevInput - El campo de entrada anterior
   * @param nextInput - El campo de entrada siguiente
   * @param event - Evento de teclado
   */
  handleKeyUp(
    currentInput: HTMLInputElement, 
    prevInput: HTMLInputElement | null, 
    nextInput: HTMLInputElement | null, 
    event: KeyboardEvent
  ) {
    if (event.key === 'Backspace' && currentInput.value === '' && prevInput) {
      prevInput.focus(); // Enfoca el campo anterior si se presiona 'Backspace' y el campo actual está vacío
    } else if (event.key !== 'Backspace' && nextInput && currentInput.value !== '') {
      nextInput.focus(); // Enfoca el siguiente campo si se ingresa un valor y no es 'Backspace'
    }

    // Si es el último campo y tiene un valor, intenta verificar el código
    if (!nextInput && currentInput.value !== '') {
      this.verifyCode();
    }
  }

  /**
   * Verifica el código de verificación ingresado por el usuario.
   */
  verifyCode() {
    const fullCode = this.verificationDigits.join(''); // Junta los dígitos en una sola cadena

    if (!this.username || fullCode.length !== 6) {
      this.toastr.error('Por favor, ingresa el código de verificación completo.', 'Error'); // Mensaje de error si el código no es válido
      return;
    }

    // Llama al servicio para verificar el correo electrónico
    this.adminService.verifyEmail(this.username, fullCode).subscribe(
      () => {
        this.toastr.success('Correo electrónico verificado con éxito, ahora verifica tu número celular', 'Éxito'); // Éxito en la verificación
        this.router.navigate(['/envioDeCelular'], { queryParams: { username: this.username } }); // Redirige a la página de verificación de número
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.msg || 'Error al verificar el correo electrónico', 'Error'); // Muestra un mensaje de error en caso de fallo
      }
    );
  }

  /**
   * Formatea el tiempo restante en formato MM:SS.
   * 
   * @returns {string} - El tiempo restante formateado.
   */
  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60); // Calcula los minutos
    const seconds = this.timeLeft % 60; // Calcula los segundos

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Devuelve el formato MM:SS
  }

  /**
   * Reenvía el código de verificación por correo electrónico y reinicia el temporizador.
   */
  resendVerificationCode() {
    this.adminService.resendVerificationEmail(this.username).subscribe(
      () => {
        this.toastr.success('Se ha reenviado el código de verificación.', 'Éxito'); // Éxito al reenviar el código
        this.timeLeft = 120; // Reinicia el temporizador
        this.startTimer(); // Inicia el temporizador nuevamente
        this.timerVisible = true; // Muestra el temporizador
      },
      error => {
        this.toastr.error('No se pudo reenviar el código de verificación. Inténtalo de nuevo.', 'Error'); // Error al reenviar el código
      }
    );
  }
}
