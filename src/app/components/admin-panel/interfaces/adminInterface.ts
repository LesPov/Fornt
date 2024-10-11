export interface AdminInterface {
    id?: number;
    username: string;
    password?: string;
    email?: string;
    rol?: string;
    isVerified?: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    verificationCode?: string | null;
    verificationCodeExpiration?: Date | null;
    phoneNumber?: string | null;
    randomPassword?: string | null;
    passwordorrandomPassword?: string; 
  }
  