import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminInterface } from '../../interfaces/adminInterface';
import { AdminService } from '../../services/adminService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { handleLoginError, handleLoginSuccess } from './utils/loginUtils';

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
        handleLoginSuccess(response, this.user, this.router, this.toastr); // Usamos la función del archivo utils
      },
      (error: HttpErrorResponse) => {
        handleLoginError(error, this.toastr); // Usamos la función del archivo utils
      }
    );
  }
}