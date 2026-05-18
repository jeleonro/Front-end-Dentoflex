import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

import { RouterModule } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonDatetime
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonDatetime,
    HeaderComponent,
    FooterComponent,
    RouterModule
  ]
})
export class CitaPage implements OnInit {

  constructor() { }

  selectedDate: string = '';
  selectedTime: string = '';
  selectedDoctor: any = null;

  minDate = new Date().toISOString();

  availableTimes: string[] = [
    '10:00 AM',
    '11:30 AM',
    '2:00 PM',
    '4:30 PM'
  ];

  doctors = [
    {
      id: 1,
      name: 'Dr. Górdova Lopez',
      image: 'assets/doctors/doctor1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Martinez Castañeda',
      image: 'assets/doctors/doctor2.jpg'
    },
    {
      id: 3,
      name: 'Dra. Romero Huancal',
      image: 'assets/doctors/doctor3.jpg'
    }
  ];

  selectTime(time: string) {
    this.selectedTime = time;
  }

  selectDoctor(doctor: any) {
    this.selectedDoctor = doctor;
  }

  canConfirm(): boolean {
    return !!(
      this.selectedDate &&
      this.selectedTime &&
      this.selectedDoctor
    );
  }

  ngOnInit() {
  }

}
