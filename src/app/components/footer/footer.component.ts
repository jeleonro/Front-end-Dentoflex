import { Component, OnInit } from '@angular/core';
import { IonIcon,IonButton } from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import { notificationsOutline, calendarOutline, timeOutline,chatbubbleOutline, home, settingsOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    IonIcon,IonButton, RouterModule
  ]
})
export class FooterComponent  implements OnInit {

  constructor() {
    addIcons({notificationsOutline,calendarOutline,chatbubbleOutline,timeOutline,home,settingsOutline}); }

  ngOnInit() {}

}
