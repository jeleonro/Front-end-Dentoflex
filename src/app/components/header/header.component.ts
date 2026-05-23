import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  notificationsOutline, closeOutline, calendarOutline,
  alarmOutline, closeCircleOutline, happyOutline, chevronDownOutline
} from 'ionicons/icons';
import { IonIcon, IonBadge, IonButton } from '@ionic/angular/standalone';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonIcon, IonBadge, IonButton, CommonModule],
})
export class HeaderComponent implements OnInit {
  showPanel = false;
  mostrarTodas = false;
  readonly LIMITE = 4;

  constructor(
    public notifService: NotificationService,
    public auth: AuthService,
  ) {
    addIcons({
      notificationsOutline, closeOutline, calendarOutline,
      alarmOutline, closeCircleOutline, happyOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.notifService.generarNotificaciones();
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
    if (this.showPanel) {
      // Pequeño delay para marcar como leídas (UX: el badge desaparece al abrir)
      setTimeout(() => this.notifService.marcarTodasLeidas(), 2000);
    } else {
      this.mostrarTodas = false;
    }
  }

  cerrarPanel() {
    this.showPanel = false;
    this.mostrarTodas = false;
  }

  get notificacionesVisibles() {
    const lista = this.notifService.notificaciones();
    return this.mostrarTodas ? lista : lista.slice(0, this.LIMITE);
  }

  get hayMas(): boolean {
    return !this.mostrarTodas &&
      this.notifService.notificaciones().length > this.LIMITE;
  }

  verMas() {
    this.mostrarTodas = true;
  }
}