import { Component, inject } from '@angular/core';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../../shared/components/app-input-text/app-input-text.component';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppCalendarComponent } from '../../shared/components/app-calendar/app-calendar.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { AccountClient, RegisterDto, UserDto } from '../../services/api';
import { AccountService } from '../../services/account.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppInputTextComponent,
    CardModule,
    AppCalendarComponent,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private accountClient = inject(AccountClient);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  protected form = new FormGroup({
    confirmPassword: new FormControl<string>('', [Validators.required]),
    dateOfBirth: new FormControl<Date>(undefined, [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    gender: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    surname: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
  });
  protected minDate: Date = new Date(1900, 0, 1);
  protected maxDate: Date = new Date(
    new Date().getFullYear() - 13,
    new Date().getMonth(),
    new Date().getDate()
  );

  public async signUp() {
    const control = this.form.controls;

    if (control.password.value !== control.confirmPassword.value) {
      this.messageService.add({
        severity: 'danger',
        summary: 'Fail',
        detail: 'Passwords do not match',
      });
      return;
    }
    const input: RegisterDto = new RegisterDto({
      dateOfBirth: control.dateOfBirth.value,
      email: control.email.value,
      gender: control.gender.value,
      name: control.name.value,
      password: control.password.value,
      surname: control.surname.value,
      username: control.username.value,
    });

    const result: UserDto = await firstValueFrom(
      this.accountClient.register(input)
    );

    if (result) {
      this.accountService.setUser(result);
      this.router.navigateByUrl('/');
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Your account has been created properly',
    });
  }

  public goLogIn() {
    this.router.navigateByUrl('/login');
  }
}
