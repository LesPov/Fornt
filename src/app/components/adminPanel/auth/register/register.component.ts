import { Component } from '@angular/core';
import { AdminInterface } from '../../interfaces/adminInterface';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/adminService';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { isPasswordValid, handleSuccess, handleError } from './utils/register.utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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

  confirmPassword: string = '';
  showPasswordCriteriaModal: boolean = false;
  isPasswordValid: boolean = true;

  constructor(
    private toastr: ToastrService,
    private adminService: AdminService,
    private router: Router
  ) { }

  /**
   * Función que maneja el registro del usuario.
   */
  registerUser() {
    this.isPasswordValid = isPasswordValid(this.user, this.confirmPassword, this.toastr);
    if (!this.isPasswordValid) return;

    this.adminService.register(this.user).subscribe(
      () => handleSuccess(this.user, this.toastr, this.router),
      (error: HttpErrorResponse) => handleError(error, this.toastr)
    );
  }

  /**
   * Abre el modal que muestra los criterios de la contraseña.
   */
  openPasswordCriteriaModal() {
    this.showPasswordCriteriaModal = true;
  }

  /**
   * Cierra el modal que muestra los criterios de la contraseña.
   */
  closePasswordCriteriaModal() {
    this.showPasswordCriteriaModal = false;
  }
}
