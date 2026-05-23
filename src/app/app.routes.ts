import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/paciente/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/paciente/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'main',
    loadComponent: () => import('./pages/paciente/main/main.page').then(m => m.MainPage),
    canActivate: [authGuard],
  },
  {
    path: 'cita',
    loadComponent: () => import('./pages/paciente/cita/cita.page').then(m => m.CitaPage),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/paciente/profile-user/profile-user.page').then(m => m.ProfileUserPage),
    canActivate: [authGuard],
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./pages/paciente/recuperar-contrasena/recuperar-contrasena.page').then( m => m.RecuperarContrasenaPage)
  },

];
