import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../services/adminService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  username: string = '';
  verificationDigits: string[] = ['', '', '', '', '', ''];
  showUsernameForm: boolean = true;
  showConfirmationMessage: boolean = false;
  timeLeft: number = 120;
  interval: any;
  timerVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.showUsernameForm = false;
      }
    });
    this.startTimer();
  }

  startTimer() {
    this.timerVisible = true;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.timerVisible = false;
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  showConfirmationDialog() {
    this.showConfirmationMessage = true;
  }

  handleKeyUp(
    currentInput: HTMLInputElement,
    prevInput: HTMLInputElement | null,
    nextInput: HTMLInputElement | null,
    event: KeyboardEvent
  ) {
    if (this.shouldMoveToPrevInput(event, currentInput, prevInput)) {
      prevInput!.focus();
    } else if (this.shouldMoveToNextInput(event, currentInput, nextInput)) {
      nextInput!.focus();
    } else if (this.isLastInputFilled(currentInput, nextInput)) {
      this.verifyCode();
    }
  }

  private shouldMoveToPrevInput(
    event: KeyboardEvent,
    currentInput: HTMLInputElement,
    prevInput: HTMLInputElement | null
  ): boolean {
    return event.key === 'Backspace' && currentInput.value === '' && !!prevInput;
  }

  private shouldMoveToNextInput(
    event: KeyboardEvent,
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement | null
  ): boolean {
    return event.key !== 'Backspace' && !!nextInput && currentInput.value !== '';
  }

  private isLastInputFilled(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null): boolean {
    return !nextInput && currentInput.value !== '';
  }

  // Refactor para simplificar la verificación
  verifyCode() {
    const fullCode = this.verificationDigits.join('');

    if (this.isInvalidCode(fullCode)) {
      this.toastr.error('Por favor, ingresa el código de verificación completo.', 'Error');
      return;
    }

    this.verifyEmailServiceCall(fullCode);
  }

  // Nueva función para manejar la validación del código
  private isInvalidCode(code: string): boolean {
    return !this.username || code.length !== 6;
  }

  // Nueva función para hacer la llamada al servicio de verificación
  private verifyEmailServiceCall(code: string) {
    this.adminService.verifyEmail(this.username, code).subscribe(
      () => this.onVerificationSuccess(),
      (error: HttpErrorResponse) => this.onVerificationError(error)
    );
  }

  // Nueva función para manejar el éxito de la verificación
  private onVerificationSuccess() {
    this.toastr.success('Correo electrónico verificado con éxito, ahora verifica tu número celular', 'Éxito');
    this.router.navigate(['/envioDeCelular'], { queryParams: { username: this.username } });
  }

  // Nueva función para manejar errores de verificación
  private onVerificationError(error: HttpErrorResponse) {
    this.toastr.error(error.error.msg || 'Error al verificar el correo electrónico', 'Error');
  }

  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  resendVerificationCode() {
    this.adminService.resendVerificationEmail(this.username).subscribe(
      () => {
        this.toastr.success('Se ha reenviado el código de verificación.', 'Éxito');
        this.timeLeft = 120;
        this.startTimer();
        this.timerVisible = true;
      },
      error => {
        this.toastr.error('No se pudo reenviar el código de verificación. Inténtalo de nuevo.', 'Error');
      }
    );
  }
}
