import { Injectable, signal } from '@angular/core';
import { CitaService } from './cita.service';
import { AuthService } from './auth.service';

export interface Notificacion {
    id: string;
    tipo: 'cita_proxima' | 'cita_confirmada' | 'cita_cancelada' | 'bienvenida';
    titulo: string;
    mensaje: string;
    fecha: Date;
    leida: boolean;
    icono: string;
    color: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    notificaciones = signal<Notificacion[]>([]);

    constructor(
        private citaService: CitaService,
        private auth: AuthService,
    ) { }

    // Genera notificaciones basadas en el estado actual de las citas
    generarNotificaciones() {
        const lista: Notificacion[] = [];
        const ahora = new Date();

        // Notificación de bienvenida
        lista.push({
            id: 'bienvenida',
            tipo: 'bienvenida',
            titulo: '¡Bienvenido a DentoFlex!',
            mensaje: `Hola ${this.auth.currentUser()?.nombres}, tu salud dental es nuestra prioridad.`,
            fecha: new Date(),
            leida: false,
            icono: 'happy-outline',
            color: '#2a9d8f',
        });

        const citas = this.citaService.misCitas();

        for (const cita of citas) {
            const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
            const diffMs = fechaCita.getTime() - ahora.getTime();
            const diffHoras = diffMs / (1000 * 60 * 60);
            const diffDias = diffHoras / 24;
            const dentista = `${cita.dentistas?.nombres ?? ''} ${cita.dentistas?.apellidos ?? ''}`.trim();

            // Cita en menos de 24 horas
            if (cita.estado === 'pendiente' || cita.estado === 'confirmada') {
                if (diffHoras > 0 && diffHoras <= 24) {
                    lista.push({
                        id: `proxima-24h-${cita.id}`,
                        tipo: 'cita_proxima',
                        titulo: '⏰ Cita en menos de 24 horas',
                        mensaje: `Tu cita con ${dentista} es hoy a las ${cita.hora}.`,
                        fecha: new Date(),
                        leida: false,
                        icono: 'alarm-outline',
                        color: '#e76f51',
                    });
                }

                // Cita en menos de 3 días
                if (diffDias > 1 && diffDias <= 3) {
                    lista.push({
                        id: `proxima-3d-${cita.id}`,
                        tipo: 'cita_proxima',
                        titulo: '📅 Cita próxima',
                        mensaje: `Tienes cita con ${dentista} el ${fechaCita.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })} a las ${cita.hora}.`,
                        fecha: new Date(),
                        leida: false,
                        icono: 'calendar-outline',
                        color: '#f4a261',
                    });
                }
            }

            // Cita cancelada recientemente (últimas 48h)
            if (cita.estado === 'cancelada') {
                const diffAbsHoras = Math.abs(diffHoras);
                if (diffAbsHoras <= 48) {
                    lista.push({
                        id: `cancelada-${cita.id}`,
                        tipo: 'cita_cancelada',
                        titulo: 'Cita cancelada',
                        mensaje: `Tu cita con ${dentista} fue cancelada.`,
                        fecha: new Date(),
                        leida: false,
                        icono: 'close-circle-outline',
                        color: '#e63946',
                    });
                }
            }
        }

        this.notificaciones.set(lista);
    }

    get noLeidas(): number {
        return this.notificaciones().filter(n => !n.leida).length;
    }

    marcarTodasLeidas() {
        this.notificaciones.update(lista =>
            lista.map(n => ({ ...n, leida: true }))
        );
    }

    marcarLeida(id: string) {
        this.notificaciones.update(lista =>
            lista.map(n => n.id === id ? { ...n, leida: true } : n)
        );
    }
}