import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFooter, IonButton, IonButtons } from '@ionic/angular/standalone';
import { medkitOutline, notificationsOutline, calendarOutline, listOutline, chevronForwardOutline, timeOutline, home, settingsOutline } from 'ionicons/icons';
import {addIcons} from 'ionicons';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, IonFooter, IonButton, IonButtons]
})
export class MainPage implements OnInit {

  constructor() {
          addIcons({calendarOutline,medkitOutline,listOutline,chevronForwardOutline,timeOutline,home,settingsOutline,notificationsOutline});}

  ngOnInit() {
  }

}
