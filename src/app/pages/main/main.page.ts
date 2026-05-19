import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFooter, IonButton, IonButtons } from '@ionic/angular/standalone';
import { medkitOutline, notificationsOutline, calendarOutline, listOutline, chevronForwardOutline, timeOutline, home, settingsOutline } from 'ionicons/icons';
import {addIcons} from 'ionicons';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, HeaderComponent, FooterComponent,IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, IonFooter, IonButton, IonButtons, RouterModule]
})
export class MainPage implements OnInit {

  constructor() {
          addIcons({calendarOutline,medkitOutline,listOutline,chevronForwardOutline,timeOutline,home,settingsOutline,notificationsOutline});}

  ngOnInit() {
  }

}
