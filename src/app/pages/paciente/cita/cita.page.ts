import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline, personOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import {
  IonContent, IonButton, IonIcon, IonDatetime, IonSpinner, IonChip, IonLabel,
  ToastController
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CitaService, Dentista } from '../../../services/cita.service';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonButton, IonIcon, IonDatetime, IonSpinner, IonChip, IonLabel,
    HeaderComponent, FooterComponent,
  ],
})
export class CitaPage implements OnInit {
  // Selecciones del usuario
  selectedDate = '';
  selectedTime = '';
  selectedDoctor: Dentista | null = null;
  minDate = new Date().toISOString();

  // Datos de la API
  doctors: Dentista[] = [];
  availableTimes: string[] = [];

  // Estados de carga
  loadingDoctors = false;
  loadingTimes = false;
  loadingConfirm = false;

  // Mensaje de conflicto de horario del paciente
  conflictMsg = '';

  constructor(
    private citaService: CitaService,
    private router: Router,
    private toast: ToastController,
  ) {
    addIcons({ calendarOutline, timeOutline, personOutline, checkmarkCircleOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loadingDoctors = true;
    this.citaService.getDentistas().subscribe({
      next: (data) => { this.doctors = data; this.loadingDoctors = false; },
      error: () => { this.loadingDoctors = false; this.showToast('Error al cargar dentistas', 'danger'); },
    });
  }

  onDateChange(event: CustomEvent) {
    this.selectedDate = (event.detail.value as string).split('T')[0];
    this.resetSlot();
    if (this.selectedDoctor) this.loadTimes();
  }

  selectDoctor(doctor: Dentista) {
    // Si ya está seleccionado, deseleccionar
    if (this.selectedDoctor?.id === doctor.id) {
      this.selectedDoctor = null;
      this.resetSlot();
      return;
    }
    this.selectedDoctor = doctor;
    this.resetSlot();
    if (this.selectedDate) this.loadTimes();
  }

  private loadTimes() {
    if (!this.selectedDoctor || !this.selectedDate) return;
    this.loadingTimes = true;
    this.availableTimes = [];

    this.citaService.getHorariosDisponibles(this.selectedDoctor.id, this.selectedDate).subscribe({
      next: (res) => {
        this.availableTimes = res.disponibles;
        this.loadingTimes = false;

        // Marcar horarios bloqueados por citas del propio paciente (mismo día, otra hora ocupada)
        const misHoras = this.citaService.misCitas()
          .filter((c) => c.fecha === this.selectedDate && ['pendiente', 'confirmada'].includes(c.estado))
          .map((c) => c.hora);

        this.pacienteHorasOcupadas = new Set(misHoras);
      },
      error: () => { this.loadingTimes = false; },
    });
  }

  // Horas que el paciente ya tiene ocupadas ese día (con cualquier doctor)
  pacienteHorasOcupadas = new Set<string>();

  selectTime(time: string) {
    if (this.pacienteHorasOcupadas.has(time)) {
      this.conflictMsg = `Ya tienes una cita a las ${time}. Elige otro horario.`;
      return;
    }
    this.conflictMsg = '';
    this.selectedTime = time;
  }

  isTimeBlocked(time: string): boolean {
    return this.pacienteHorasOcupadas.has(time);
  }

  private resetSlot() {
    this.selectedTime = '';
    this.availableTimes = [];
    this.conflictMsg = '';
    this.pacienteHorasOcupadas = new Set();
  }

  canConfirm(): boolean {
    return !!(this.selectedDate && this.selectedTime && this.selectedDoctor && !this.loadingConfirm);
  }

  confirmarCita() {
    if (!this.canConfirm() || !this.selectedDoctor) return;
    this.loadingConfirm = true;

    this.citaService.crearCita({
      dentista_id: this.selectedDoctor.id,
      fecha: this.selectedDate,
      hora: this.selectedTime,
    }).subscribe({
      next: async () => {
        this.loadingConfirm = false;
        const t = await this.toast.create({
          message: '✅ ¡Cita agendada exitosamente!',
          color: 'success', duration: 2000, position: 'top',
        });
        await t.present();
        // Volver al main; el signal ya fue actualizado en el servicio
        setTimeout(() => this.router.navigateByUrl('/main'), 1800);
      },
      error: async (err) => {
        this.loadingConfirm = false;
        const msg: string = err.error?.error ?? 'Error al agendar la cita';
        // Si es conflicto de horario, mostrarlo inline también
        if (err.status === 409) this.conflictMsg = msg;
        const t = await this.toast.create({ message: msg, color: 'danger', duration: 3500, position: 'top' });
        t.present();
      },
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const t = await this.toast.create({ message, duration: 3000, color, position: 'top' });
    t.present();
  }
}
