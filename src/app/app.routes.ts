import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'main',
    loadComponent: () => import('./pages/main/main.page').then( m => m.MainPage)
  },
  {
    path: 'cita',
    loadComponent: () => import('./pages/cita/cita.page').then( m => m.CitaPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-user/profile-user.page').then( m => m.ProfileUserPage)
  }


];
