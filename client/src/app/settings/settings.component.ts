import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ImageModule } from 'primeng/image';
import {
  FileParameter,
  MemberDto,
  UpdateUserDto,
  UsersClient,
} from '../services/api';
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
    console.log('link:');
    console.log(this.user.profilePhotoUrl);
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
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadProfilePhoto(file);
      }
    };
    fileInput.click();
  }

  public async uploadProfilePhoto(file: File) {
    const fileParam: FileParameter = {
      data: file,
      fileName: file.name,
    };
    console.log('trying');
    try {
      const response = await firstValueFrom(
        this.usersClient.modifyProfilePicture(fileParam)
      );

      if (response) {
        this.user.profilePhotoUrl = response.url;
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  }

  public async deleteProfilePicture() {
    //TODO
    try {
      await firstValueFrom(this.usersClient.deleteProfilePhoto());
    } catch (e) {
      console.log('Error deleting photo:', e);
    }
  }

  public async onSaveChanges() {
    const updateUserDto: UpdateUserDto = new UpdateUserDto({
      username: this.form.controls.username.value,
      bio: this.form.controls.bio.value,
    });
    try {
      await firstValueFrom(this.usersClient.updateUser(updateUserDto));
      this.user.username = updateUserDto.username;
      this.user.bio = updateUserDto.bio;

      this.form.reset({
        username: this.user.username,
        bio: this.user.bio,
      });
      this.form.markAsPristine();
      this.unsavedChangesMessages = [];

      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }

  public onDiscardChanges() {
    this.router.navigateByUrl('/user-profile');
  }
}
