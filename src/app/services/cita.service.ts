import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Dentista {
  id: string;
  nombres: string;
  apellidos: string;
  especialidad: string;
  foto_url: string | null;
}

export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas: string | null;
  created_at: string;
  dentistas: Dentista;
}

export interface NuevaCitaPayload {
  dentista_id: string;
  fecha: string;
  hora: string;
  notas?: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getDentistas() {
    return this.http.get<Dentista[]>(`${this.api}/dentistas`);
  }

  getHorariosDisponibles(dentistaId: string, fecha: string) {
    return this.http.get<{ disponibles: string[] }>(
      `${this.api}/dentistas/${dentistaId}/horarios?fecha=${fecha}`
    );
  }

  getMisCitas() {
    return this.http.get<Cita[]>(`${this.api}/citas`);
  }

  crearCita(payload: NuevaCitaPayload) {
    return this.http.post<Cita>(`${this.api}/citas`, payload);
  }

  cancelarCita(id: string) {
    return this.http.delete<{ message: string }>(`${this.api}/citas/${id}`);
  }
}
