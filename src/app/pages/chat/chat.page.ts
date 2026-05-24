import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

import { Router, RouterModule } from '@angular/router';
import { Dentista } from 'src/app/services/cita.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, FooterComponent, IonButton, IonIcon, RouterModule]
})

export class ChatPage implements OnInit {

  doctor: any = null;
  fecha = '';
  hora = '';
  messages: any[] = [];

  constructor() {}

  ngOnInit() {

    console.log("LLEGA CTMRE");

    const data = localStorage.getItem('ultimaCita');

    console.log("NOSE PQ CHCA NO LELGA");
    console.log("ACA ESTA LA DATA", data);

    if (data) {

      const cita = JSON.parse(data);

      console.log("CITA:");
      console.log(cita);

      this.doctor = cita.doctor;
      this.fecha = cita.fecha;
      this.hora = cita.hora;

      this.messages = [
        {
          tipo: 'received',
          texto: `Recordatorio: Cita programada para ${this.fecha} a las ${this.hora}`,
          hora: 'Ahora'
        },
      ];

      console.log(this.messages);

    }

  }

}