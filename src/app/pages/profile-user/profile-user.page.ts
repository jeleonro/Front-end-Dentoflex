import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  callOutline,
  mailOutline,
  clipboardOutline,
  downloadOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.page.html',
  styleUrls: ['./profile-user.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, IonButton, IonButtons]
})
export class ProfileUserPage implements OnInit {

  constructor() {
    addIcons({
      personCircleOutline,
      callOutline,
      mailOutline,
      clipboardOutline,
      downloadOutline
    });
  }

  ngOnInit() {
  }

}
