import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  sendOutline,
  arrowBackOutline,
  personCircleOutline,
  chatbubbleOutline,
} from 'ionicons/icons';
import {
  IonContent,
  IonIcon,
  IonButton,
  IonFooter,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ChatService, Mensaje } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonIcon,
    IonButton,
    IonFooter,
    IonSpinner,
  ],
})
export class ChatPage implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollBottom') scrollBottom!: ElementRef;

  citaId = '';
  mensaje = '';
  enviando = false;
  loading = true;

  constructor(
    public chatService: ChatService,
    public auth: AuthService,
    public citaService: CitaService,
    private route: ActivatedRoute,
  ) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      chatbubbleOutline,
      sendOutline,
    });
  }

  ngOnInit() {
    this.citaId = this.route.snapshot.paramMap.get('citaId') ?? '';
    if (this.citaId) {
      this.chatService.cargarMensajes(this.citaId);
      this.chatService.cargarInfoCita(this.citaId); // cargar info para mostrar en el header
      this.loading = false;
    }
  }

  private lastMsgCount = 0;

  ngAfterViewChecked() {
    const current = this.chatService.mensajes().length;
    if (current !== this.lastMsgCount) {
      this.lastMsgCount = current;
      this.scrollToBottom();
    }
  }

  ngOnDestroy() {
    this.chatService.desconectar();
    this.chatService.mensajes.set([]);
    this.chatService.infoCita.set(null); // para evitar mostrar info de la cita anterior al entrar a otro chat
  }

  get cita() {
    return (
      this.citaService.misCitas().find((c) => c.id === this.citaId) ?? null
    );
  }

  get miId(): string {
    // El emisor_id en mensajes siempre es auth.users.id
    // que está guardado en localStorage como parte del token
    const token = this.auth.getToken();
    if (!token) return '';

    try {
      // Decodificar el JWT sin librería (solo el payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? '';
    } catch {
      return '';
    }
  }

  esMio(msg: Mensaje): boolean {
    return msg.emisor_id === this.miId;
  }

  enviar() {
    const texto = this.mensaje.trim();
    if (!texto || this.enviando) return;

    this.enviando = true;
    this.mensaje = '';

    this.chatService.enviarMensaje(this.citaId, texto).subscribe({
      next: (msg) => {
        // Agregar el propio mensaje inmediatamente (sin esperar Realtime)
        this.chatService.mensajes.update((msgs) => [...msgs, msg]);
        this.enviando = false;
      },
      error: () => {
        this.enviando = false;
        this.mensaje = texto;
      },
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  private scrollToBottom() {
    try {
      this.scrollBottom.nativeElement.scrollTop =
        this.scrollBottom.nativeElement.scrollHeight;
    } catch {}
  }
}
