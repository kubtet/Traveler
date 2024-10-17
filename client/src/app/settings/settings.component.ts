import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { MemberDto, UsersClient } from '../services/api';
import { AccountService } from '../services/account.service';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { firstValueFrom } from 'rxjs';

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
  @HostListener('window:beforeunload', ['$event'])
  notify($event: any) {
    if (this.form.dirty) {
      $event.returnValue = true;
    }
  }
  // private toastr = inject(ToastrService);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private usersClient = inject(UsersClient);

  protected user: MemberDto;

  public form = new FormGroup({
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

    const userTemp = await firstValueFrom(
      this.usersClient.getUserByUsername(currentUserName)
    );
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
            severity: 'warn',
            summary: 'Unsaved changes',
            detail: "You've made some changes that haven't been saved.",
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

  public onSaveChanges() {
    //TODO
    console.log(this.user);
    // this.toastr.success('Profile updated successfully!');
    this.form.reset({
      username: this.user.username,
      bio: this.user.bio,
    });
    this.unsavedChangesMessages = [];
  }

  public onDiscardChanges() {
    this.router.navigateByUrl('/user-profile');
  }
}
