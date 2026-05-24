import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  // ruta paciente
  {
    path: 'main',
    loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage),
    canActivate: [authGuard],
  },
  {
    path: 'cita',
    loadComponent: () => import('./pages/cita/cita.page').then(m => m.CitaPage),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-user/profile-user.page').then(m => m.ProfileUserPage),
    canActivate: [authGuard],
  },
  // rutas dentista
  {
    path: 'dentista',
    canActivate: [roleGuard('dentista')],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/dentista/home/dentista-home.page').then(m => m.DentistaHomePage),
      },
      {
        path: 'citas',
        loadComponent: () => import('./pages/dentista/citas/dentista-citas.page').then(m => m.DentistaCitasPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./pages/recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat-list.page').then(m => m.ChatListPage),
    canActivate: [authGuard],
  },
  {
    path: 'chat/:citaId',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage),
    canActivate: [authGuard],
  },

];
