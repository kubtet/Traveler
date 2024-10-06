import { Component, inject } from '@angular/core';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../../shared/components/app-input-text/app-input-text.component';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AccountClient, LoginDto, UserDto } from '../../services/api';
import { AccountService } from '../../services/account.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AppButtonComponent, AppInputTextComponent, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private accountClient = inject(AccountClient);
  private accountService = inject(AccountService);
  protected username: FormControl<string> = new FormControl<string>('');
  protected password: FormControl<string> = new FormControl<string>('');

  public async login() {
    const input: LoginDto = new LoginDto({
      username: this.username.value,
      password: this.password.value,
    });

    const result: UserDto = await firstValueFrom(
      this.accountClient.login(input)
    );

    console.log(result);

    if (result) {
      this.accountService.setUser(result);
      this.router.navigateByUrl('/');
    }
  }

  public goSignUp() {
    this.router.navigateByUrl('/register');
  }
}
