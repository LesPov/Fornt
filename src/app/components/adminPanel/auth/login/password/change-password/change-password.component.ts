import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../services/adminService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'] // Asegúrate de que sea 'styleUrls' para los estilos
})
export class ChangePasswordComponent implements OnInit {
  username: string = ''; 
  randomPassword: string = ''; 
  newPassword: string = '';
  repeatNewPassword: string = '';
  
  constructor(
    private toastr: ToastrService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.randomPassword = ''; 
    });
  }
  
  changePassword() {
    // Validar que las contraseñas coincidan
    if (this.newPassword !== this.repeatNewPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.toastr.error('No se encontró el token de autenticación', 'Error');
      return;
    }
  
    // Realizar la solicitud para cambiar la contraseña
    this.adminService.resetPassword(this.username, this.randomPassword, this.newPassword, token).subscribe(
      () => {
        this.toastr.success('Contraseña cambiada con éxito');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastr.error(error.error.msg, 'Error');
      }
    );
  }
}
