// shared-routes.ts
import { Routes } from '@angular/router';

export const sharedRoutes: Routes = [
  { path: 'home', loadComponent: () => import('../home.component').then(m => m.HomeComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];