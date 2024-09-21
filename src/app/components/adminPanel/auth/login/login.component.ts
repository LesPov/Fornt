import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminInterface } from '../../interfaces/adminInterface';
import { AdminService } from '../../services/adminService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Importa módulos necesarios para los formularios y enlaces
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  user: AdminInterface = {
    username: '',
    passwordorrandomPassword: '', // Cambiado para permitir el uso de contraseña o contraseña aleatoria
  };
  username: any;
 
  constructor(
    private toastr: ToastrService,
    private adminService: AdminService, // Inyección del servicio AdminService para registrar al usuario
    private router: Router
    ) { }


  ngOnInit(): void { }

  loginUser() {
  

    this.adminService.login(this.user).subscribe(
      (response) => {
        if (response.token) {
          this.toastr.success(`Bienvenido, ${this.user.username}!`);
  
          // Almacenar token y userId en localStorage
          localStorage.setItem('token', response.token);
          if (response.userId) {
            localStorage.setItem('userId', response.userId);
          }
          if (response.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            if (response.passwordorrandomPassword === 'randomPassword') {
              this.router.navigate(['login/change-password'], { queryParams: { username: this.user.username } });
            } else {
              this.router.navigate(['/worker']);
            }

          }
        }
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.msg || 'Hubo un error al iniciar sesion', 'Error');
      }
    );
  }
} 