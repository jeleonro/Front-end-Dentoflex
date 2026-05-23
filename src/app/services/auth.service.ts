import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  // Signals reactivos con el estado del usuario
  currentUser = signal<Paciente | null>(null);
  isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {
    if (this.hasToken()) this.loadProfile();
  }

  register(payload: RegisterPayload) {
    return this.http.post<{ message: string }>(
      `${this.api}/auth/register`, payload
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${this.api}/auth/login`, { email, password }
    ).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.isLoggedIn.set(true);
        this.loadProfile();
      })
    );
  }

  logout() {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigateByUrl('/login');
  }

  loadProfile() {
    this.http.get<Paciente>(`${this.api}/pacientes/me`).subscribe({
      next: (p) => this.currentUser.set(p),
      error: () => this.logout(),
    });
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
