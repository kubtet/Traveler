import { Component, OnInit, inject } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { UsersClient } from '../services/api';
import { AccountService } from '../services/account.service';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { FormControl, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    InputTextareaModule,
    ImageModule,
    AppButtonComponent,
    AppInputTextComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private accountService = inject(AccountService);
  private usersClient = inject(UsersClient);

  protected user: any;

  usernameControl: FormControl;
  bioControl: FormControl;

  async ngOnInit() {
    // TODO get updateuserdto instead of userdto !!!
    this.user = await this.usersClient.getUserByUsername(
      this.accountService.currentUser().username
    );
    this.usernameControl = new FormControl(this.user.username || '', [
      Validators.required,
      Validators.maxLength(15),
    ]);

    this.bioControl = new FormControl(this.user.bio || '', [
      Validators.maxLength(100),
    ]);
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
