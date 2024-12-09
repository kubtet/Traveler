import { Component, inject } from '@angular/core';
import { AccountClient, BuggyClient, RegisterDto } from '../../../api';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css',
})
export class TestErrorsComponent {
  private accountClient = inject(AccountClient);
  private buggyClient = inject(BuggyClient);

  async get400Error() {
    await firstValueFrom(this.buggyClient.getBadRequest());
  }

  async get401Error() {
    await firstValueFrom(this.buggyClient.getAuth());
  }

  async get404Error() {
    await firstValueFrom(this.buggyClient.getNotFound());
  }

  async get500Error() {
    await firstValueFrom(this.buggyClient.getServerError());
  }

  async get400ValidationError() {
    await firstValueFrom(this.accountClient.register(new RegisterDto()));
  }
}
