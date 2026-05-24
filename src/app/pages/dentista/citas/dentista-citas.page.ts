import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, filterOutline } from 'ionicons/icons';
import {
  IonContent, IonIcon, IonButton, IonSpinner, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { DentistaService, CitaDentista } from '../../../services/dentista.service';

type FiltroEstado = 'todas' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

@Component({
  selector: 'app-dentista-citas',
  templateUrl: './dentista-citas.page.html',
  styleUrls: ['./dentista-citas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    IonContent, IonIcon, IonButton, IonSpinner, IonSelect, IonSelectOption,
  ],
})
export class DentistaCitasPage implements OnInit {
  loading = true;
  todasLasCitas: CitaDentista[] = [];
  filtro: FiltroEstado = 'todas';

  constructor(private dentistaService: DentistaService) {
    addIcons({ arrowBackOutline, calendarOutline, filterOutline });
  }

  ngOnInit() {
    this.dentistaService.getMisCitas().subscribe({
      next: (citas) => { this.todasLasCitas = citas; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get citasFiltradas(): CitaDentista[] {
    if (this.filtro === 'todas') return this.todasLasCitas;
    return this.todasLasCitas.filter(c => c.estado === this.filtro);
  }

  cambiarFiltro(event: CustomEvent) {
    this.filtro = event.detail.value;
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
}