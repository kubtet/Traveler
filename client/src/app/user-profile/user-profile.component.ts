import { Component, OnInit, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccountService } from '../services/account.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { MemberDto, UsersClient } from '../services/api';
import { Router } from '@angular/router';
import { MyTravelsComponent } from '../travels/my-travels.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    AppButtonComponent,
    AvatarModule,
    AvatarGroupModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    MyTravelsComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private router = inject(Router);
  protected accountService = inject(AccountService);
  private usersClient = inject(UsersClient);
  protected user: MemberDto;

  async ngOnInit() {
    console.log(this.accountService.currentUser().username);
    this.user = await firstValueFrom(
      this.usersClient.getUserByUsername(
        this.accountService.currentUser().username
      )
    );
  }

  public goToSettings() {
    this.router.navigateByUrl('/settings');
  }

  protected logOut() {
    this.accountService.logOut();
  }
}
