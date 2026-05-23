import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
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

  // Signal global: todas las citas del paciente
  misCitas = signal<Cita[]>([]);

  constructor(private http: HttpClient) {}

  // Carga las citas y actualiza el signal
  cargarCitas() {
    return this.http.get<Cita[]>(`${this.api}/citas`).pipe(
      tap((citas) => this.misCitas.set(citas))
    );
  }

  getDentistas() {
    return this.http.get<Dentista[]>(`${this.api}/dentistas`);
  }

  getHorariosDisponibles(dentistaId: string, fecha: string) {
    return this.http.get<{ disponibles: string[] }>(
      `${this.api}/dentistas/${dentistaId}/horarios?fecha=${fecha}`
    );
  }

  crearCita(payload: NuevaCitaPayload) {
    return this.http.post<Cita>(`${this.api}/citas`, payload).pipe(
      // Al crear, recargamos la lista completa para mantener el signal sincronizado
      tap(() => this.cargarCitas().subscribe())
    );
  }

  cancelarCita(id: string) {
    return this.http.delete<{ message: string }>(`${this.api}/citas/${id}`).pipe(
      tap(() => {
        // Actualiza el estado en el signal sin necesidad de llamar al servidor
        this.misCitas.update((citas) =>
          citas.map((c) => (c.id === id ? { ...c, estado: 'cancelada' as const } : c))
        );
      })
    );
  }

  // Computed: próxima cita activa
  get proximaCita(): Cita | null {
    const activas = this.misCitas().filter((c) =>
      ['pendiente', 'confirmada'].includes(c.estado)
    );
    // Ordenar por fecha+hora y devolver la más próxima
    activas.sort((a, b) =>
      `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`)
    );
    return activas[0] ?? null;
  }

  // Computed: citas pasadas
  get historialCitas(): Cita[] {
    return this.misCitas()
      .filter((c) => ['completada', 'cancelada'].includes(c.estado))
      .slice(0, 3);
  }
}
