import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonButton, IonInput, IonIcon,
  IonSpinner, ToastController, IonItem, IonBackButton, IonToolbar, IonButtons, IonHeader
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonInput, IonIcon, IonSpinner, RouterModule, IonItem, IonBackButton, IonButtons, IonHeader, IonToolbar]
})

export class RecuperarContrasenaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
