import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  personCircleOutline, callOutline, mailOutline, clipboardOutline,
  downloadOutline, createOutline, closeOutline, cameraOutline,
  checkmarkOutline, logOutOutline, idCardOutline, calendarOutline,
  maleFemaleOutline
} from 'ionicons/icons';
import {
  IonContent, IonIcon, IonButton, IonInput, IonSpinner,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService, Paciente, UsuarioActual } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.page.html',
  styleUrls: ['./profile-user.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonButton, IonInput, IonSpinner,
    CommonModule, FormsModule, FooterComponent,
  ],
})
export class ProfileUserPage implements OnInit {
  editMode = false;
  loading = false;
  uploadingFoto = false;

  // Solo estos dos son editables
  telefono = '';
  email = '';

  constructor(
    public auth: AuthService,
    public citaService: CitaService,
    private http: HttpClient,
    private toast: ToastController,
    private alertCtrl: AlertController,
  ) {
    addIcons({
      personCircleOutline, callOutline, mailOutline, clipboardOutline,
      downloadOutline, createOutline, closeOutline, cameraOutline,
      checkmarkOutline, logOutOutline, idCardOutline, calendarOutline,
      maleFemaleOutline
    });
  }

  ngOnInit() {
    this.syncFields();
    // Cargar citas si aún no están en el signal
    if (this.citaService.misCitas().length === 0) {
      this.citaService.cargarCitas().subscribe();
    }
  }

  private syncFields() {
    const u = this.paciente;
    if (!u) return;
    this.telefono = u.telefono;
    this.email = u.email;
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) this.syncFields(); // cancelar → restaurar valores
  }

  // ── Guardar teléfono y email ──────────────
  guardarCambios() {
  const payload: Record<string, string> = {};
  const current = this.paciente;

  if (this.telefono && this.telefono !== current?.telefono) payload['telefono'] = this.telefono;
  if (this.email    && this.email    !== current?.email)    payload['email']     = this.email;

  if (Object.keys(payload).length === 0) { this.editMode = false; return; }

  this.loading = true;
  this.http.put<Paciente>(`${environment.apiUrl}/pacientes/me`, payload).subscribe({
    next: (updated) => {
      this.auth.currentUser.set(updated);
      this.loading = false;
      this.editMode = false;
      this.showToast('Perfil actualizado ✅', 'success');
    },
    error: (err) => {
      this.loading = false;
      this.showToast(err.error?.error ?? 'Error al actualizar', 'danger');
    },
  });
}

  // ── Seleccionar y subir foto ────────────────────────────────────
  seleccionarFoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/jpg';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        this.showToast('La imagen no debe superar 2MB', 'warning');
        return;
      }
      this.subirFoto(file);
    };
    input.click();
  }

  private subirFoto(file: File) {
    this.uploadingFoto = true;

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];

      if (!base64) {
        this.uploadingFoto = false;
        this.showToast('No se pudo leer la imagen', 'danger');
        return;
      }

      console.log('Enviando foto:', { mimeType: file.type, base64Length: base64.length });

      this.http.post<{ foto_url: string }>(
        `${environment.apiUrl}/pacientes/me/foto`,
        { base64, mimeType: file.type }
      ).subscribe({
        next: () => {
          this.auth.loadProfile();
          this.uploadingFoto = false;
          this.showToast('Foto actualizada ✅', 'success');
        },
        error: (err) => {
          console.error('Error subiendo foto:', err);
          this.uploadingFoto = false;
          this.showToast('Error al subir la foto', 'danger');
        },
      });
    });

    reader.addEventListener('error', () => {
      this.uploadingFoto = false;
      this.showToast('Error al leer el archivo', 'danger');
    });

    reader.readAsDataURL(file);
  }

  // ── Cerrar sesión con confirmación ─────────────────────────────
  async confirmarLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', role: 'destructive', handler: () => this.auth.logout() },
      ],
    });
    await alert.present();
  }

  // ── Helpers ────────────────────────────────────────────────────
  get totalCitas(): number {
    return this.citaService.misCitas().length;
  }

  get citasCompletadas(): number {
    return this.citaService.misCitas().filter(c => c.estado === 'completada').length;
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const t = await this.toast.create({ message, duration: 2500, color, position: 'top' });
    t.present();
  }

  get paciente(): Paciente | null {
    const u = this.auth.currentUser();
    return u && 'telefono' in u ? (u as Paciente) : null;
  }
}