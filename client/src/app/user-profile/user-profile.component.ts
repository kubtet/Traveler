import { Component, ViewEncapsulation, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccountService } from '../services/account.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { TravelsComponent } from "../travels/travels.component";

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
    TravelsComponent
],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  protected accountService = inject(AccountService);
}
