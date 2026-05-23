import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline, person, calendar, lockClosedOutline, eyeOffOutline, eyeOutline,
  idCardOutline, maleFemale, maleOutline, femaleOutline, call
} from 'ionicons/icons';
import {
  IonContent, IonLabel, IonSegment, IonButton, IonSegmentButton,
  IonInput, IonIcon, IonSelect, IonSelectOption, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { AuthService, RegisterPayload } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonLabel, IonButton, IonSegment, IonSegmentButton,
    IonInput, IonIcon, CommonModule, FormsModule, IonSelect, IonSelectOption,
    IonSpinner, RouterModule
  ],
})
export class RegisterPage {
  @ViewChild('fechaInput', { read: ElementRef }) fechaInput!: ElementRef;

  nombres = '';
  apellidos = '';
  fechaNacimiento = '1999-01-01';
  tipoDocumento: 'dni' | 'pasaporte' | 'c.e' = 'dni';
  numeroDocumento = '';
  genero: 'masculino' | 'femenino' | 'otro' = 'masculino';
  telefono = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ person, calendar, idCardOutline, maleFemale, maleOutline, femaleOutline, call, mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline });
  }

  abrirFecha(event: Event) {
    const input = this.fechaInput?.nativeElement?.querySelector('input');
    if (input) input.showPicker();
  }

  cambiarGenero(event: CustomEvent) {
    this.genero = event.detail.value;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onRegister() {
    if (!this.nombres || !this.apellidos || !this.email || !this.password) {
      this.showToast('Completa todos los campos requeridos', 'warning');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden', 'warning');
      return;
    }
    if (this.password.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    this.loading = true;

    const payload: RegisterPayload = {
      email: this.email,
      password: this.password,
      nombres: this.nombres,
      apellidos: this.apellidos,
      fecha_nacimiento: this.fechaNacimiento,
      tipo_documento: this.tipoDocumento,
      numero_documento: this.numeroDocumento,
      genero: this.genero,
      telefono: this.telefono,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('¡Cuenta creada! Revisa tu correo para confirmarla.', 'success');
        setTimeout(() => this.router.navigateByUrl('/login'), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.showToast(err.error?.error ?? 'Error al registrarse', 'danger');
      },
    });
  }

  private async showToast(message: string, color: 'danger' | 'warning' | 'success') {
    const t = await this.toast.create({ message, duration: 3500, color, position: 'top' });
    t.present();
  }
}
