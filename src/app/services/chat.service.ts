import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Mensaje {
  id: string;
  cita_id: string;
  emisor_id: string;
  emisor_rol: 'paciente' | 'dentista';
  contenido: string;
  leido: boolean;
  created_at: string;
}

// Para mostrar info básica en la lista de chats
export interface InfoCita {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  pacientes: {
    id: string;
    nombres: string;
    apellidos: string;
    foto_url: string | null;
  };
  dentistas: {
    id: string;
    nombres: string;
    apellidos: string;
    especialidad: string;
    foto_url: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly api = environment.apiUrl;

  mensajes = signal<Mensaje[]>([]);
  noLeidos = signal<Record<string, number>>({});

  // Cliente Supabase solo para Realtime (no necesita service key)
  private supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
  );

  private channel: RealtimeChannel | null = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  // Cargar mensajes de una cita y suscribirse a nuevos
  cargarMensajes(citaId: string) {
    // 1. Cargar historial
    this.http.get<Mensaje[]>(`${this.api}/chat/${citaId}`).subscribe({
      next: (msgs) => this.mensajes.set(msgs),
    });

    // 2. Suscribirse a nuevos mensajes en tiempo real
    this.suscribirse(citaId);
  }

  private suscribirse(citaId: string) {
  this.desconectar();

  const token = this.auth.getToken();
  if (token) {
    this.supabase.realtime.setAuth(token);
  }

  this.channel = this.supabase
    .channel(`chat-${citaId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes',
        filter: `cita_id=eq.${citaId}`,
      },
      (payload) => {
        console.log('🔴 Realtime recibido:', payload); // ← debug
        const nuevo = payload.new as Mensaje;
        const yaExiste = this.mensajes().some(m => m.id === nuevo.id);
        if (!yaExiste) {
          this.mensajes.update(msgs => [...msgs, nuevo]);
          this.cargarNoLeidos();
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 Estado Realtime:', status); // ← debug
    });
}

  enviarMensaje(citaId: string, contenido: string) {
    return this.http.post<Mensaje>(`${this.api}/chat/${citaId}`, { contenido });
  }

  cargarNoLeidos() {
    this.http
      .get<Record<string, number>>(`${this.api}/chat/no-leidos`)
      .subscribe({
        next: (data) => this.noLeidos.set(data),
      });
  }

  get totalNoLeidos(): number {
    return Object.values(this.noLeidos()).reduce((a, b) => a + b, 0);
  }

  desconectar() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  // Para mostrar info básica en la lista de chats
  infoCita = signal<InfoCita | null>(null);

  cargarInfoCita(citaId: string) {
    this.http.get<InfoCita>(`${this.api}/chat/${citaId}/info`).subscribe({
      next: (info) => this.infoCita.set(info),
    });
  }
}
