import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { adminRoutes } from './components/admin-panel/routes/admin.routes';
import { sharedRoutes } from './components/home/routes/shared-routes';


export const routes: Routes = [
  ...adminRoutes,
  // ...userRoutes,
  ...sharedRoutes,
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
