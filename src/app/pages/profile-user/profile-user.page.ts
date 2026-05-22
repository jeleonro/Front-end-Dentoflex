import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  personCircleOutline, callOutline, mailOutline, clipboardOutline, downloadOutline, createOutline
} from 'ionicons/icons';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons, IonInput,
  IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService, Paciente } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.page.html',
  styleUrls: ['./profile-user.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, FooterComponent, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonIcon, IonButton, IonButtons, IonInput, IonSpinner
  ],
})
export class ProfileUserPage implements OnInit {
  editMode = false;
  loading = false;

  // Campos editables
  telefono = '';
  nombres = '';
  apellidos = '';

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private toast: ToastController
  ) {
    addIcons({ personCircleOutline, callOutline, mailOutline, clipboardOutline, downloadOutline, createOutline });
  }

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) this.syncFields(u);
  }

  private syncFields(u: Paciente) {
    this.nombres = u.nombres;
    this.apellidos = u.apellidos;
    this.telefono = u.telefono;
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      const u = this.auth.currentUser();
      if (u) this.syncFields(u);
    }
  }

  guardarCambios() {
    this.loading = true;
    this.http.put<Paciente>(`${environment.apiUrl}/pacientes/me`, {
      nombres: this.nombres,
      apellidos: this.apellidos,
      telefono: this.telefono,
    }).subscribe({
      next: (updated) => {
        this.auth.currentUser.set(updated);
        this.loading = false;
        this.editMode = false;
        this.showToast('Perfil actualizado', 'success');
      },
      error: () => {
        this.loading = false;
        this.showToast('Error al actualizar el perfil', 'danger');
      },
    });
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const t = await this.toast.create({ message, duration: 2500, color, position: 'top' });
    t.present();
  }
}
