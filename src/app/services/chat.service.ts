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

@Injectable({ providedIn: 'root' })
export class ChatService {
    private readonly api = environment.apiUrl;

    mensajes = signal<Mensaje[]>([]);
    noLeidos = signal<Record<string, number>>({});

    // Cliente Supabase solo para Realtime (no necesita service key)
    private supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseAnonKey
    );

    private channel: RealtimeChannel | null = null;

    constructor(private http: HttpClient, private auth: AuthService) { }

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
        // Limpiar canal anterior si existe
        this.desconectar();

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
                    const nuevo = payload.new as Mensaje;
                    // Evitar duplicados (el propio emisor ya lo ve al enviar)
                    const yaExiste = this.mensajes().some(m => m.id === nuevo.id);
                    if (!yaExiste) {
                        this.mensajes.update(msgs => [...msgs, nuevo]);
                    }
                }
            )
            .subscribe();
    }

    enviarMensaje(citaId: string, contenido: string) {
        return this.http.post<Mensaje>(`${this.api}/chat/${citaId}`, { contenido });
    }

    cargarNoLeidos() {
        this.http.get<Record<string, number>>(`${this.api}/chat/no-leidos`).subscribe({
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
}