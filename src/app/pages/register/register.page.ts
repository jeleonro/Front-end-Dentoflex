import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  mailOutline,
  person,
  calendar,
  lockClosedOutline,
  eyeOffOutline,
  logoGoogle, idCard, idCardOutline, idCardSharp, female, maleFemale, male, maleOutline, femaleOutline, cellular, call } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonLabel, IonSegment, IonButton, IonSegmentButton, IonInput, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonLabel, IonButton, IonSegment, IonSegmentButton, IonInput, IonIcon, CommonModule, FormsModule, IonSelect, IonSelectOption,  RouterModule]
})
export class RegisterPage implements OnInit {
  @ViewChild('fechaInput', { read: ElementRef }) fechaInput!: ElementRef;

  constructor() {
    addIcons({person,calendar,idCard,maleFemale,maleOutline,femaleOutline,call,cellular,logoGoogle,female,male,idCardSharp,idCardOutline,eyeOffOutline,lockClosedOutline,mailOutline});
  }

  abrirFecha(event: Event) {
    const input = this.fechaInput.nativeElement.querySelector('input');
    if (input) input.showPicker();
  }

  generoSeleccionado: string = 'masculino';

  cambiarGenero(event: any) {
    this.generoSeleccionado = event.detail.value;
  }

  ngOnInit() {
  }

}
