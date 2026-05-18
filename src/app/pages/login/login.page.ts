import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  mailOutline,
  lockClosedOutline,
  eyeOffOutline,
  logoGoogle,
  logoFacebook,
  logoApple, medkitOutline, notificationsOutline, calendarOutline, listOutline, chevronForwardOutline, timeOutline, home, settingsOutline } from 'ionicons/icons';
import {addIcons} from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonInput, IonIcon ,RouterModule]
})
export class LoginPage implements OnInit {

  constructor() {
      addIcons({medkitOutline,notificationsOutline,calendarOutline,listOutline,chevronForwardOutline,timeOutline,home,settingsOutline,mailOutline,lockClosedOutline,eyeOffOutline,logoGoogle}); }

  ngOnInit() {
  }

}
