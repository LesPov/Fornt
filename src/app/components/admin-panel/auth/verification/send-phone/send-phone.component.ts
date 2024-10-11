import { HttpErrorResponse } from '@angular/common/http'; // Maneja respuestas de error HTTP
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Manejo de rutas y enlaces en Angular
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones de éxito o error
import { AdminService } from '../../../services/adminService'; // Servicio personalizado que maneja la interacción con el backend
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-phone',
  standalone: true, // Es un componente independiente, no necesita estar dentro de un módulo
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para formularios y enlaces
  templateUrl: './send-phone.component.html', // Archivo de plantilla HTML asociado
  styleUrl: './send-phone.component.css' // Archivo CSS asociado
})
export class SendPhoneComponent {
  // Definición de variables usadas en el componente
  username: string = ''; // Almacena el nombre de usuario
  selectedCountryCode: string = ''; // Código de país seleccionado
  phoneNumber: string = ''; // Número de teléfono ingresado
  showUsernameForm: boolean = true; // Controla si se muestra el formulario de nombre de usuario
  showConfirmationMessage: boolean = false; // Controla si se muestra un mensaje de confirmación
  countries: any[] = []; // Lista de países y sus códigos telefónicos
  showLogo: boolean | undefined; // Controla la visibilidad del logo basado en el país seleccionado
  showCountryName: boolean | undefined; // Controla la visibilidad del nombre del país seleccionado

  constructor(
    private adminService: AdminService, // Servicio para interactuar con el backend
    private route: ActivatedRoute, // Proporciona acceso a los parámetros de la ruta activa
    private toastr: ToastrService, // Servicio para mostrar notificaciones tipo toastr
    private router: Router // Servicio para navegación entre rutas
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga los parámetros de la URL, como el nombre de usuario, y obtiene la lista de países.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username']; // Obtiene el nombre de usuario desde los parámetros de la URL
      if (this.username) {
        this.showUsernameForm = false; // Oculta el formulario de nombre de usuario si ya está en la URL
      }
    });

    this.loadCountries(); // Carga la lista de países cuando el componente se inicia
  }

  /**
   * Actualiza la visibilidad de elementos visuales como el logo o el nombre del país,
   * en función del código de país seleccionado.
   */
  onCountryCodeChange() {
    this.showLogo = this.selectedCountryCode === '+57'; // Muestra el logo si el país es Colombia (código +57)
    this.showCountryName = this.selectedCountryCode !== '+57'; // Muestra el nombre del país si no es Colombia
  }

  /**
   * Llama al servicio AdminService para obtener la lista de países con sus códigos telefónicos
   * y los almacena en la propiedad `countries`.
   */
  loadCountries() {
    this.adminService.getCountries().subscribe(
      countries => {
        this.countries = countries; // Asigna la lista de países a la propiedad `countries`
      },
      error => {
        console.error('Error al obtener la lista de códigos de país:', error); // Maneja errores si la petición falla
      }
    );
  }

  /**
   * Muestra un mensaje de confirmación en pantalla, activando la variable `showConfirmationMessage`.
   */
  showConfirmationDialog() {
    this.showConfirmationMessage = true;
  }

  /**
   * Registra el número de teléfono ingresado. Valida que todos los campos requeridos estén completos,
   * formatea el número de teléfono y lo envía al backend para su registro.
   * En caso de éxito, redirige al usuario a la página de verificación del número de teléfono.
   */
  registerPhoneNumber() {
    // Verifica que el nombre de usuario, el código de país y el número de teléfono estén completos
    if (!this.username || !this.selectedCountryCode || !this.phoneNumber) {
      this.toastr.error('Por favor, ingresa un código de país y un número de teléfono válido.', 'Error'); // Muestra un mensaje de error si faltan datos
      return;
    }

    // Formatea el número de teléfono concatenando el código de país y eliminando cualquier carácter no numérico
    const formattedPhoneNumber = this.selectedCountryCode + this.phoneNumber.replace(/\D/g, '');

    // Llama al servicio AdminService para registrar el número de teléfono en el backend
    this.adminService.registerPhoneNumber(this.username, formattedPhoneNumber).subscribe(
      () => {
        this.phoneNumber = formattedPhoneNumber; // Asigna el número formateado a la propiedad `phoneNumber`
        this.toastr.success('Se ha enviado un código de verificación a tu número de teléfono.', 'Éxito'); // Muestra un mensaje de éxito
        
        // Redirige a la página de verificación con el nombre de usuario y el número de teléfono como parámetros
        this.router.navigate(['/verificacionCelular'], { queryParams: { username: this.username, phoneNumber: formattedPhoneNumber } });
      },
      (error: HttpErrorResponse) => {
        // Manejo de errores: muestra el mensaje de error del backend si existe, o un mensaje genérico
        if (error.error && error.error.msg) {
          this.toastr.error(error.error.msg, 'Error');
        } else {
          this.toastr.error('Error al enviar el código de verificación.', 'Error');
        }
      }
    );
  }
}
