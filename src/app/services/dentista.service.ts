import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface PacienteResumen {
    id: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    email: string;
    foto_url: string | null;
}

export interface CitaDentista {
    id: string;
    fecha: string;
    hora: string;
    estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
    notas: string | null;
    pacientes: PacienteResumen;
}

@Injectable({ providedIn: 'root' })
export class DentistaService {
    private readonly api = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getCitasHoy() {
        return this.http.get<CitaDentista[]>(`${this.api}/dentista/citas-hoy`);
    }

    getMisCitas() {
        return this.http.get<CitaDentista[]>(`${this.api}/dentista/mis-citas`);
    }

    actualizarEstado(id: string, estado: 'confirmada' | 'completada' | 'cancelada') {
        return this.http.put(`${this.api}/dentista/citas/${id}/estado`, { estado });
    }
}