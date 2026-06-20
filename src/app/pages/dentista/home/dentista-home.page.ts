import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  calendarOutline, checkmarkCircleOutline, timeOutline,
  personOutline, medkitOutline, logOutOutline, listOutline, chatbubbleOutline
} from 'ionicons/icons';
import {
  IonContent, IonIcon, IonButton, IonSpinner, IonBadge,
  ToastController
} from '@ionic/angular/standalone';
import { DentistaService, CitaDentista } from '../../../services/dentista.service';
import { AuthService, DentistaPerfil } from '../../../services/auth.service';
@Component({
  selector: 'app-dentista-home',
  templateUrl: './dentista-home.page.html',
  styleUrls: ['./dentista-home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, IonIcon, IonButton, IonSpinner, IonBadge,
  ],
})
export class DentistaHomePage implements OnInit {
  loading = true;
  citasHoy: CitaDentista[] = [];

  constructor(
    public auth: AuthService,
    public dentistaService: DentistaService,
    private toast: ToastController,
  ) {
    addIcons({ calendarOutline, checkmarkCircleOutline, timeOutline, personOutline, medkitOutline, logOutOutline, listOutline, chatbubbleOutline });
  }

  ngOnInit() {
    this.cargarCitasHoy();
  }

  cargarCitasHoy() {
    this.loading = true;
    this.dentistaService.getCitasHoy().subscribe({
      next: (citas) => { this.citasHoy = citas; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get pendientes(): number {
    return this.citasHoy.filter(c => c.estado === 'pendiente').length;
  }

  get confirmadas(): number {
    return this.citasHoy.filter(c => c.estado === 'confirmada').length;
  }

  get dentista(): DentistaPerfil | null {
    const u = this.auth.currentUser();
    return u && 'especialidad' in u ? (u as DentistaPerfil) : null;
  }

  async confirmarCita(id: string) {
    this.dentistaService.actualizarEstado(id, 'confirmada').subscribe({
      next: () => {
        this.citasHoy = this.citasHoy.map(c =>
          c.id === id ? { ...c, estado: 'confirmada' } : c
        );
        this.showToast('Cita confirmada ✅', 'success');
      },
      error: () => this.showToast('Error al confirmar', 'danger'),
    });
  }

  async completarCita(id: string) {
    this.dentistaService.actualizarEstado(id, 'completada').subscribe({
      next: () => {
        this.citasHoy = this.citasHoy.filter(c => c.id !== id);
        this.showToast('Cita completada 🎉', 'success');
      },
      error: () => this.showToast('Error al completar', 'danger'),
    });
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const t = await this.toast.create({ message, duration: 2500, color, position: 'top' });
    t.present();
  }
}