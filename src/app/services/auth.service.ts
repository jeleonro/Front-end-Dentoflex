import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type Rol = 'paciente' | 'dentista' | 'admin';

export interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  tipo_documento: 'dni' | 'pasaporte' | 'c.e';
  numero_documento: string;
  genero: 'masculino' | 'femenino' | 'otro';
  telefono: string;
  email: string;
  foto_url: string | null;
  rol: Rol;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  tipo_documento: 'dni' | 'pasaporte' | 'c.e';
  numero_documento: string;
  genero: 'masculino' | 'femenino' | 'otro';
  telefono: string;
}

export interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  tipo_documento: 'dni' | 'pasaporte' | 'c.e';
  numero_documento: string;
  genero: 'masculino' | 'femenino' | 'otro';
  telefono: string;
  email: string;
  foto_url: string | null;
  rol: Rol;
}

export interface DentistaPerfil {
  id: string;
  nombres: string;
  apellidos: string;
  especialidad: string;
  foto_url: string | null;
  activo: boolean;
  rol: Rol;
}

export type UsuarioActual = Paciente | DentistaPerfil;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  currentUser = signal<UsuarioActual | null>(null);
  isLoggedIn = signal<boolean>(this.hasToken());
  rol = signal<Rol | null>(localStorage.getItem('rol') as Rol | null);

  constructor(private http: HttpClient, private router: Router) {
  // Restaurar rol desde localStorage inmediatamente (síncrono)
  const savedRol = localStorage.getItem('rol') as Rol | null;
  if (savedRol) this.rol.set(savedRol);

  if (this.hasToken()) {
    this.isLoggedIn.set(true);
    this.loadProfile();
  }
}

  register(payload: RegisterPayload) {
    return this.http.post<{ message: string }>(`${this.api}/auth/register`, payload);
  }

  login(email: string, password: string) {
    return this.http.post<{ access_token: string; refresh_token: string; rol: Rol }>(
      `${this.api}/auth/login`, { email, password }
    ).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        localStorage.setItem('rol', res.rol);
        this.isLoggedIn.set(true);
        this.rol.set(res.rol);
        this.loadProfile();
      })
    );
  }

  logout() {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('rol');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.rol.set(null);
    this.router.navigateByUrl('/login');
  }



  loadProfile() {
    const rol = this.rol();
    const endpoint = rol === 'dentista'
      ? `${this.api}/dentista/perfil`
      : `${this.api}/pacientes/me`;

    this.http.get<Paciente>(endpoint).subscribe({
      next: (p) => this.currentUser.set(p),
      error: (err) => {
        // Solo hacer logout si el token realmente expiró (401)
        // No hacer logout por errores de red (0) o servidor (500)
        if (err.status === 401) {
          this.logout();
        }
      },
    });
  }

  getToken(): string | null { return localStorage.getItem('access_token'); }
  private hasToken(): boolean { return !!localStorage.getItem('access_token'); }
}
