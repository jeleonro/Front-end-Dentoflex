import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, calendarOutline, timeOutline, chatbubbleOutline, home, settingsOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonBadge, CommonModule, RouterModule],
})
export class FooterComponent implements OnInit {
  constructor(public chatService: ChatService) {
    addIcons({ notificationsOutline, calendarOutline, chatbubbleOutline, timeOutline, home, settingsOutline });
  }
  ngOnInit() {}
}