export interface LoginResponse {
    userId: any;
    passwordorrandomPassword: string;
    token: string;
    rol: string;
    isEmailVerified: boolean; // Agrega esta propiedad
    isPhoneVerified: boolean; // Agrega esta propiedad
    
  }
  