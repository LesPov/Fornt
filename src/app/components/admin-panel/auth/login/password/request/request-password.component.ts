import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../services/adminService';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-request-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './request-password.component.html',
  styleUrl: './request-password.component.css'
})
export class RequestPasswordComponent {
  usernameOrEmail: string = '';
  loading: boolean = false;
  showConfirmationMessage: boolean = false;

  constructor(
    private toastr: ToastrService,
    private adminService: AdminService, // Servicio para la autenticación
    private router: Router
  ) { }
  showConfirmationDialog() {
    this.showConfirmationMessage = true;
  }

  requestPasswordReset() {
    if (!this.usernameOrEmail) {
      this.toastr.error('Por favor, ingresa tu usuario o correo electrónico', 'Error');
      return;
    }

    this.loading = true;
    this.adminService.requestPasswordReset(this.usernameOrEmail).subscribe(
      (response) => {
        this.loading = false;
        this.toastr.success('Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña.');
        this.router.navigate(['/login']); // O la ruta a la que redirigir después de solicitar la recuperación
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(error.error.msg, 'Error');
      }
    );
  }
}
