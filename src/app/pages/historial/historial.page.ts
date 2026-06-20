import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  timeOutline, calendarOutline, checkmarkCircleOutline,
  closeCircleOutline, hourglassOutline, medkitOutline
} from 'ionicons/icons';
import {
  IonContent, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CitaService, Cita } from '../../services/cita.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, IonIcon, IonSpinner,
    FooterComponent, HeaderComponent,
  ],
})
export class HistorialPage implements OnInit {
  loading = true;

  constructor(public citaService: CitaService) {
    addIcons({ timeOutline, calendarOutline, checkmarkCircleOutline, closeCircleOutline, hourglassOutline, medkitOutline });
  }

  ngOnInit() {
    if (this.citaService.misCitas().length === 0) {
      this.citaService.cargarCitas().subscribe({
        next: () => { this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }

  get todasLasCitas(): Cita[] {
    return [...this.citaService.misCitas()].sort((a, b) =>
      `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`)
    );
  }

  get citasCompletadas(): number {
    return this.citaService.misCitas().filter(c => c.estado === 'completada').length;
  }

  get citasActivas(): number {
    return this.citaService.misCitas().filter(c => ['pendiente', 'confirmada'].includes(c.estado)).length;
  }

  get citasCanceladas(): number {
    return this.citaService.misCitas().filter(c => c.estado === 'cancelada').length;
  }

  estadoColor(estado: string): string {
    const map: Record<string, string> = {
      pendiente:  '#f4a261',
      confirmada: '#27c498',
      completada: '#17324d',
      cancelada:  '#e63946',
    };
    return map[estado] ?? '#888';
  }

  estadoIcono(estado: string): string {
    const map: Record<string, string> = {
      pendiente:  'hourglass-outline',
      confirmada: 'checkmark-circle-outline',
      completada: 'medkit-outline',
      cancelada:  'close-circle-outline',
    };
    return map[estado] ?? 'time-outline';
  }
}