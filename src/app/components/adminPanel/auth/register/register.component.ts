import { Component } from '@angular/core';
import { AdminInterface } from '../../interfaces/adminInterface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
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
  loading: boolean = false;

}
