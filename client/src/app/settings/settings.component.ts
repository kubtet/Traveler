import { Component, OnInit, inject } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { MemberDto, UsersClient } from '../services/api';
import { AccountService } from '../services/account.service';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    InputTextareaModule,
    ImageModule,
    AppButtonComponent,
    AppInputTextComponent,
    MessagesModule,
    DividerModule,
    FormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private accountService = inject(AccountService);
  private usersClient = inject(UsersClient);

  protected user: MemberDto;

  protected form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    bio: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
  });

  unsavedChangesMessages: Message[] = [];

  async ngOnInit() {
    await this.loadUser();
    this.unsavedChangesMessages = [];

    // this.form.controls.username.valueChanges.subscribe(()=> this.onInputChange())
    this.onInputChange();
  }

  public async loadUser() {
    const currentUserName = this.accountService.currentUser().username;
    if (!currentUserName) return;

    const userTemp = await this.usersClient.getUserByUsername(currentUserName);
    this.user = userTemp;
    this.form.controls.username.setValue(userTemp.username);
    this.form.controls.bio.setValue(userTemp.bio);
  }

  public onInputChange() {
    this.form.valueChanges.subscribe(() => {
      if (
        this.form.controls.username.value !== this.user.username ||
        this.form.controls.bio.value !== this.user.bio
      ) {
        this.unsavedChangesMessages = [
          {
            severity: 'warn', // Poziom ważności
            summary: 'Niezapisane zmiany', // Nagłówek
            detail: 'Dokonałeś zmian, które jeszcze nie zostały zapisane.', // Szczegóły
          },
        ];
      } else {
        this.unsavedChangesMessages = [];
      }
    });
  }

  public updateProfilePicture() {
    //TODO
  }

  public deleteProfilePicture() {
    //TODO
  }

  public save() {
    //TODO
  }

  public cancel() {
    this.router.navigateByUrl('/user-profile');
  }
}
