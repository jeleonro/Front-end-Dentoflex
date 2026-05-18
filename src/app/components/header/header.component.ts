import { Component, OnInit } from '@angular/core';
import {
  IonIcon,
  IonBadge,IonButton
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonIcon,
    IonBadge,IonButton
  ]
})
export class HeaderComponent  implements OnInit {

  // @Input() patientName: string = 'Paciente';

  constructor() { 
    
  }
  
  ngOnInit() {}

}
