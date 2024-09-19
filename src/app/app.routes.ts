import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    { path: 'registro', loadComponent: () => import('./components/adminPanel/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'login', loadComponent: () => import('./components/adminPanel/auth/login/login.component').then(m => m.LoginComponent) },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
