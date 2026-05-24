import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  medkitOutline, notificationsOutline, calendarOutline, listOutline,
  chevronForwardOutline, timeOutline, home, settingsOutline, closeCircleOutline
} from 'ionicons/icons';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonIcon,
  IonFooter, IonButton, IonButtons, IonSpinner, IonBadge,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { CitaService, Cita } from '../../services/cita.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFooter,
    IonButton, IonButtons, IonSpinner, IonBadge,
    CommonModule, RouterModule,
    HeaderComponent, FooterComponent,
  ],
})
export class MainPage implements OnInit {
  loading = true;

  constructor(
    public auth: AuthService,
    public citaService: CitaService,
    private router: Router,
    private alertCtrl: AlertController,
    private toast: ToastController,
  ) {
    addIcons({ calendarOutline, medkitOutline, listOutline, chevronForwardOutline, timeOutline, home, settingsOutline, notificationsOutline, closeCircleOutline });
  }

  ngOnInit() {
    this.recargarCitas();

    // Cada vez que se navega de vuelta a /main, refrescar las citas
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (e.urlAfterRedirects === '/main') this.recargarCitas();
      });
  }

  recargarCitas() {
    this.loading = true;
    this.citaService.cargarCitas().subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false),
    });
  }

  get proximaCita(): Cita | null {
    return this.citaService.proximaCita;
  }

  get historialCitas(): Cita[] {
    return this.citaService.historialCitas;
  }

  async confirmarCancelacion(cita: Cita) {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar Cita',
      message: `¿Seguro que deseas cancelar tu cita del ${new Date(cita.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'long' })} a las ${cita.hora}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, cancelar',
          role: 'destructive',
          handler: () => this.cancelarCita(cita.id),
        },
      ],
    });
    await alert.present();
  }

  private cancelarCita(id: string) {
    this.citaService.cancelarCita(id).subscribe({
      next: async () => {
        const t = await this.toast.create({ message: 'Cita cancelada', color: 'warning', duration: 2500, position: 'top' });
        t.present();
      },
      error: async () => {
        const t = await this.toast.create({ message: 'Error al cancelar', color: 'danger', duration: 2500, position: 'top' });
        t.present();
      },
    });
  }

  estadoColor(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'var(--ion-color-warning)',
      confirmada: 'var(--ion-color-success)',
      cancelada: 'var(--ion-color-danger)',
      completada: 'var(--ion-color-medium)',
    };
    return map[estado] ?? 'inherit';
  }
}
