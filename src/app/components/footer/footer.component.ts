import { Component, OnInit } from '@angular/core';
import { IonIcon,IonButton } from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOffOutline,
  logoGoogle,
  logoFacebook,
  logoApple, medkitOutline, notificationsOutline, calendarOutline, timeOutline,chatbubbleOutline, home, settingsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
   imports: [
    IonIcon,IonButton
  ]
})
export class FooterComponent  implements OnInit {

  constructor() {
    addIcons({notificationsOutline,calendarOutline,chatbubbleOutline,timeOutline,home,settingsOutline}); }

  ngOnInit() {}

}
