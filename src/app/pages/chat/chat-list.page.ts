import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, chevronForwardOutline } from 'ionicons/icons';
import { IonContent, IonIcon, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CitaService, Cita } from '../../services/cita.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.page.html',
    styleUrls: ['./chat-list.page.scss'],
    standalone: true,
    imports: [
        CommonModule, RouterModule,
        IonContent, IonIcon, IonSpinner, IonBadge,
        FooterComponent, HeaderComponent,
    ],
})
export class ChatListPage implements OnInit {
    loading = true;

    constructor(
        public citaService: CitaService,
        public chatService: ChatService,
        public auth: AuthService,
    ) {
        addIcons({ chatbubbleOutline, chevronForwardOutline });
    }

    ngOnInit() {
        if (this.citaService.misCitas().length === 0) {
            this.citaService.cargarCitas().subscribe({
                next: () => { this.chatService.cargarNoLeidos(); this.loading = false; },
            });
        } else {
            this.chatService.cargarNoLeidos();
            this.loading = false;
        }
    }

    get citasConChat(): Cita[] {
        return this.citaService.misCitas()
            .filter(c => ['pendiente', 'confirmada', 'completada'].includes(c.estado));
    }

    noLeidosDeCita(citaId: string): number {
        return this.chatService.noLeidos()[citaId] ?? 0;
    }
}