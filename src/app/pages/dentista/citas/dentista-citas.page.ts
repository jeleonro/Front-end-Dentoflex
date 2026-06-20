import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  calendarOutline,
  filterOutline,
  chatbubbleOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import {
  IonContent,
  IonIcon,
  IonButton,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import {
  DentistaService,
  CitaDentista,
} from '../../../services/dentista.service';

type FiltroEstado =
  | 'todas'
  | 'pendiente'
  | 'confirmada'
  | 'completada'
  | 'cancelada';

@Component({
  selector: 'app-dentista-citas',
  templateUrl: './dentista-citas.page.html',
  styleUrls: ['./dentista-citas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonButton,
    IonSpinner,
    IonSelect,
    IonSelectOption,
  ],
})
export class DentistaCitasPage implements OnInit {
  citas = signal<CitaDentista[]>([]);
  loading = true;
  todasLasCitas: CitaDentista[] = [];
  filtro: FiltroEstado = 'todas';

  constructor(
    private dentistaService: DentistaService,
    private alertCtrl: AlertController,
    private toast: ToastController,
  ) {
    addIcons({
      arrowBackOutline,
      calendarOutline,
      filterOutline,
      chatbubbleOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.loading = true;
    this.dentistaService.getMisCitas().subscribe({
      next: (data) => {
        this.citas.set(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get citasFiltradas(): CitaDentista[] {
    if (this.filtro === 'todas') return this.citas();
    return this.citas().filter((c) => c.estado === this.filtro);
  }

  cambiarFiltro(event: CustomEvent) {
    this.filtro = event.detail.value;
  }

  // Solo el doctor puede confirmar y completar
  async confirmarCita(cita: CitaDentista) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Cita',
      message: `¿Confirmar la cita de ${cita.pacientes?.nombres} ${cita.pacientes?.apellidos}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.dentistaService
              .actualizarEstado(cita.id, 'confirmada')
              .subscribe({
                next: () => {
                  this.actualizarLocal(cita.id, 'confirmada');
                  this.showToast('Cita confirmada ✅', 'success');
                },
                error: () => this.showToast('Error al confirmar', 'danger'),
              });
          },
        },
      ],
    });
    await alert.present();
  }

  async completarCita(cita: CitaDentista) {
    const alert = await this.alertCtrl.create({
      header: 'Completar Cita',
      message: `¿Marcar como completada la cita de ${cita.pacientes?.nombres}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Completar',
          handler: () => {
            this.dentistaService
              .actualizarEstado(cita.id, 'completada')
              .subscribe({
                next: () => {
                  this.actualizarLocal(cita.id, 'completada');
                  this.showToast('Cita completada 🎉', 'success');
                },
                error: () => this.showToast('Error al completar', 'danger'),
              });
          },
        },
      ],
    });
    await alert.present();
  }

  // Actualiza el estado localmente sin recargar todo
  private actualizarLocal(id: string, estado: CitaDentista['estado']) {
    this.citas.update((lista) =>
      lista.map((c) => (c.id === id ? { ...c, estado } : c)),
    );
  }

  estadoColor(estado: string): string {
    const map: Record<string, string> = {
      pendiente: '#f4a261',
      confirmada: '#27c498',
      completada: '#888',
      cancelada: '#e63946',
    };
    return map[estado] ?? '#888';
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const t = await this.toast.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    t.present();
  }
}
