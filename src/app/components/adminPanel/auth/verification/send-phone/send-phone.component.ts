import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../services/adminService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-phone',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './send-phone.component.html',
  styleUrl: './send-phone.component.css'
})
export class SendPhoneComponent {
  // Propiedades del componente
  username: string = ''; // Variable para almacenar el nombre de usuario
  selectedCountryCode: string = ''; // Variable para almacenar el código de país seleccionado
  phoneNumber: string = ''; // Variable para almacenar el número de teléfono
  showUsernameForm: boolean = true; // Para mostrar u ocultar el formulario de nombre de usuario
  showConfirmationMessage: boolean = false; // Para mostrar u ocultar el mensaje de confirmación
  countries: any[] = []; // Almacena la lista de países con sus códigos
  showLogo: boolean | undefined; // Para mostrar el logo dependiendo del país seleccionado
  showCountryName: boolean | undefined; // Para mostrar el nombre del país seleccionado

  constructor(
    private adminService: AdminService, // Servicio que interactúa con el backend
    private route: ActivatedRoute, // Para manejar parámetros de ruta
    private toastr: ToastrService, // Para mostrar notificaciones de éxito o error
    private router: Router // Para la navegación entre rutas
  ) {}

  /**
   * ngOnInit se ejecuta al inicializar el componente. Carga los parámetros de la URL (como el username) y la lista de países.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.showUsernameForm = false; // Oculta el formulario de nombre de usuario si ya está en la URL
      }
    });

    this.loadCountries(); // Carga los códigos de los países al iniciar el componente
  }

  /**
   * Cambia el estado de las variables showLogo y showCountryName según el código de país seleccionado.
   */
  onCountryCodeChange() {
    this.showLogo = this.selectedCountryCode === '+57'; // Ejemplo: muestra el logo si es Colombia
    this.showCountryName = this.selectedCountryCode !== '+57';
  }

  /**
   * Llama al servicio para obtener la lista de países con sus códigos telefónicos.
   */
  loadCountries() {
    this.adminService.getCountries().subscribe(
      countries => {
        this.countries = countries; // Almacena los países en la propiedad countries
      },
      error => {
        console.error('Error al obtener la lista de códigos de país:', error); // Manejo de errores en caso de fallo
      }
    );
  }

  /**
   * Muestra un cuadro de diálogo de confirmación.
   */
  showConfirmationDialog() {
    this.showConfirmationMessage = true;
  }

  /**
   * Registra el número de teléfono. Valida si se han ingresado los campos requeridos, formatea el número, y lo envía al backend.
   */
  registerPhoneNumber() {
    if (!this.username || !this.selectedCountryCode || !this.phoneNumber) {
      this.toastr.error('Por favor, ingresa un código de país y un número de teléfono válido.', 'Error');
      return; // Verifica que todos los campos estén completos antes de proceder
    }
  
    // Formatea el número de teléfono concatenando el código de país y eliminando cualquier carácter no numérico
    const formattedPhoneNumber = this.selectedCountryCode + this.phoneNumber.replace(/\D/g, '');
    
    // Llama al servicio para registrar el número de teléfono
    this.adminService.registerPhoneNumber(this.username, formattedPhoneNumber).subscribe(
      () => {
        this.phoneNumber = formattedPhoneNumber; // Almacena el número formateado
        this.toastr.success('Se ha enviado un código de verificación a tu número de teléfono.', 'Éxito');
        
        // Redirige a la página de verificación del número de teléfono
        this.router.navigate(['/verificacionCelular'], { queryParams: { username: this.username, phoneNumber: formattedPhoneNumber } });
      },
      (error: HttpErrorResponse) => {
        if (error.error && error.error.msg) {
          this.toastr.error(error.error.msg, 'Error'); // Muestra el error devuelto por el servidor
        } else {
          this.toastr.error('Error al enviar el código de verificación.', 'Error'); // Error genérico si no hay un mensaje específico
        }
      }
    );
  }
}
