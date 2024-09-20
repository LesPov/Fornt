import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    { path: 'registro', loadComponent: () => import('./components/adminPanel/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'verificacionEmail', loadComponent: () => import('./components/adminPanel/auth/verification/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
    { path: 'envioDeCelular', loadComponent: () => import('./components/adminPanel/auth/verification/send-phone/send-phone.component').then(m => m.SendPhoneComponent) },
    { path: 'verificacionCelular', loadComponent: () => import('./components/adminPanel/auth/verification/verify-phone/verify-phone.component').then(m => m.VerifyPhoneComponent) },
    { path: 'login', loadComponent: () => import('./components/adminPanel/auth/login/login.component').then(m => m.LoginComponent) },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
