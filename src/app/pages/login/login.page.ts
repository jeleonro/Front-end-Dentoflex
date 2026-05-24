import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline, logoGoogle } from 'ionicons/icons';
import {
  IonContent, IonButton, IonInput, IonIcon,
  IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonInput, IonIcon, IonSpinner, RouterModule],
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline, logoGoogle });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
  if (!this.email || !this.password) {
    this.showToast('Completa todos los campos', 'warning');
    return;
  }
  this.loading = true;

  this.auth.login(this.email, this.password).subscribe({
    next: (res) => {
      this.loading = false;
      // Redirigir según rol
      if (res.rol === 'dentista') {
        this.router.navigateByUrl('/dentista/home');
      } else {
        this.router.navigateByUrl('/main');
      }
    },
    error: (err) => {
      this.loading = false;
      this.showToast(err.error?.error ?? 'Error al iniciar sesión', 'danger');
    },
  });
}

  private async showToast(message: string, color: 'danger' | 'warning' | 'success') {
    const t = await this.toast.create({ message, duration: 3000, color, position: 'top' });
    t.present();
  }
}
