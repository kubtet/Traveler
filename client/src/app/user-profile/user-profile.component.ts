import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccountService } from '../services/account.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { UsersClient } from '../services/api';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

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
    RouterLink,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private router = inject(Router);
  protected accountService = inject(AccountService);
  private usersClient = inject(UsersClient);

  async ngOnInit() {
    const user = await this.usersClient.getUserByUsername(
      this.accountService.currentUser().username
    );
    console.log(user);
  }

  public goToSettings() {
    this.router.navigateByUrl('/settings');
  }
}
