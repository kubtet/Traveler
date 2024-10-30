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
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';

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
    AppLoadingComponent,
    AsyncPipe,
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
  protected isLoading = new BehaviorSubject(false);
  protected previewProfilePhotoUrl: string | null = null;
  protected fileToUpload: File | null = null;

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
    this.onInputChange();
  }

  public async loadUser() {
    const currentUserName = this.accountService.currentUser().username;
    if (!currentUserName) return;

    const userTemp = await firstValueFrom(
      this.usersClient.getUserByUsername(currentUserName)
    );
    this.user = userTemp;
    this.previewProfilePhotoUrl = userTemp.profilePhotoUrl;
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

  // public getProfilePhotoUrl(): string {
  //   return this.fileToUpload
  //     ? URL.createObjectURL(this.fileToUpload)
  //     : this.user.profilePhotoUrl;
  // }

  public updateProfilePicture() {
    //TODO
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadProfilePhoto(file);
        this.previewProfilePhotoUrl = URL.createObjectURL(file);
        this.fileToUpload = file;
        this.form.markAsDirty();
        this.unsavedChangesMessages = [
          {
            severity: 'warn',
            summary: 'Unsaved changes',
            detail: "You've made some changes that haven't been saved.",
          },
        ];
      }
    };
    fileInput.click();
  }

  public async uploadProfilePhoto(file: File) {
    this.isLoading.next(true);

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
        this.previewProfilePhotoUrl = response.url;
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
    this.isLoading.next(false);
  }

  public async deleteProfilePicture() {
    this.previewProfilePhotoUrl = '../../assets/defaultProfilePicture.jfif';
    this.form.markAsDirty();
    this.unsavedChangesMessages = [
      {
        severity: 'warn',
        summary: 'Unsaved changes',
        detail: "You've made some changes that haven't been saved.",
      },
    ];
  }

  public async onSaveChanges() {
    const updateUserDto: UpdateUserDto = new UpdateUserDto({
      username: this.form.controls.username.value,
      bio: this.form.controls.bio.value,
    });
    // the whole block to update user
    try {
      await firstValueFrom(this.usersClient.updateUser(updateUserDto));
      // updated photo
      console.log('preview photo utl:');
      console.log(this.previewProfilePhotoUrl);
      console.log('profile photo url');
      console.log(this.user.profilePhotoUrl);

      if (this.previewProfilePhotoUrl != this.user.profilePhotoUrl) {
        if (
          this.previewProfilePhotoUrl !=
          '../../assets/defaultProfilePicture.jfif'
        ) {
          await this.uploadProfilePhoto(this.fileToUpload);
        } else {
          try {
            await firstValueFrom(this.usersClient.deleteProfilePhoto());
          } catch (e) {
            console.log('Error deleting photo:', e);
          }
        }
      }

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
