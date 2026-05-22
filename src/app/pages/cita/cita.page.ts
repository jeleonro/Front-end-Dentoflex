import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import {
  IonContent, IonButton, IonButtons, IonIcon, IonDatetime, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { CitaService, Dentista } from '../../services/cita.service';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonButtons, IonIcon, IonDatetime, IonSpinner,
    HeaderComponent, FooterComponent, RouterModule
  ],
})
export class CitaPage implements OnInit {
  selectedDate = '';
  selectedTime = '';
  selectedDoctor: Dentista | null = null;
  minDate = new Date().toISOString();

  doctors: Dentista[] = [];
  availableTimes: string[] = [];
  loadingDoctors = false;
  loadingTimes = false;
  loadingConfirm = false;

  constructor(
    private citaService: CitaService,
    private router: Router,
    private toast: ToastController
  ) {}

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
    // ion-datetime devuelve ISO, tomamos solo la parte de fecha
    this.selectedDate = (event.detail.value as string).split('T')[0];
    this.selectedTime = '';
    this.availableTimes = [];
    if (this.selectedDoctor) this.loadTimes();
  }

  selectDoctor(doctor: Dentista) {
    this.selectedDoctor = doctor;
    this.selectedTime = '';
    this.availableTimes = [];
    if (this.selectedDate) this.loadTimes();
  }

  private loadTimes() {
    if (!this.selectedDoctor || !this.selectedDate) return;
    this.loadingTimes = true;
    this.citaService.getHorariosDisponibles(this.selectedDoctor.id, this.selectedDate).subscribe({
      next: (res) => { this.availableTimes = res.disponibles; this.loadingTimes = false; },
      error: () => { this.loadingTimes = false; },
    });
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  canConfirm(): boolean {
    return !!(this.selectedDate && this.selectedTime && this.selectedDoctor);
  }

  confirmarCita() {
    if (!this.canConfirm() || !this.selectedDoctor) return;
    this.loadingConfirm = true;

    this.citaService.crearCita({
      dentista_id: this.selectedDoctor.id,
      fecha: this.selectedDate,
      hora: this.selectedTime,
    }).subscribe({
      next: () => {
        this.loadingConfirm = false;
        this.showToast('¡Cita agendada exitosamente!', 'success');
        setTimeout(() => this.router.navigateByUrl('/main'), 1500);
      },
      error: (err) => {
        this.loadingConfirm = false;
        this.showToast(err.error?.error ?? 'Error al agendar la cita', 'danger');
      },
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const t = await this.toast.create({ message, duration: 3000, color, position: 'top' });
    t.present();
  }
}
