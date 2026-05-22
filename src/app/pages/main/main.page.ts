import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  medkitOutline, notificationsOutline, calendarOutline, listOutline,
  chevronForwardOutline, timeOutline, home, settingsOutline
} from 'ionicons/icons';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonIcon,
  IonFooter, IonButton, IonButtons, IonSpinner
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
    IonContent, IonHeader, HeaderComponent, FooterComponent,
    IonTitle, IonToolbar, CommonModule, IonIcon, IonFooter,
    IonButton, IonButtons, RouterModule, IonSpinner
  ],
})
export class MainPage implements OnInit {
  proximaCita: Cita | null = null;
  historialCitas: Cita[] = [];
  loading = true;

  constructor(
    public auth: AuthService,
    private citaService: CitaService,
    private router: Router
  ) {
    addIcons({ calendarOutline, medkitOutline, listOutline, chevronForwardOutline, timeOutline, home, settingsOutline, notificationsOutline });
  }

  ngOnInit() {
    this.citaService.getMisCitas().subscribe({
      next: (citas) => {
        this.loading = false;
        const activas = citas.filter(c => ['pendiente', 'confirmada'].includes(c.estado));
        const pasadas = citas.filter(c => ['completada', 'cancelada'].includes(c.estado));
        this.proximaCita = activas[0] ?? null;
        this.historialCitas = pasadas.slice(0, 3);
      },
      error: () => { this.loading = false; },
    });
  }

  irACitas() {
    this.router.navigateByUrl('/cita');
  }
}
