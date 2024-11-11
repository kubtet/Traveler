import { Component, OnInit, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccountService } from '../services/account.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { MemberDto, UsersClient } from '../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { MyTravelsComponent } from '../travels/travel-list/travel-list.component';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    AppButtonComponent,
    AvatarModule,
    AvatarGroupModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    MyTravelsComponent,
    AppLoadingComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersClient = inject(UsersClient);
  protected accountService = inject(AccountService);
  protected isCurrent: boolean = false;
  protected isLoading = new BehaviorSubject(false);
  protected userId: number = 0;
  protected user: MemberDto;

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.isLoading.next(true);
      this.userId = +params.get('id')!;
      if (!this.userId || this.userId === 0) {
        this.router.navigateByUrl('/not-found');
      }
      this.user = await firstValueFrom(
        this.usersClient.getUserById(this.userId)
      );
      this.checkIfCurrentUser();
      this.isLoading.next(false);
    });
  }

  protected async checkIfCurrentUser() {
    const currentUser = await firstValueFrom(
      this.usersClient.getUserByUsername(
        this.accountService.currentUser().username
      )
    );
    if (currentUser) {
      this.isCurrent = this.userId === currentUser.id;
    }
  }

  protected goToSettings() {
    this.router.navigateByUrl('/settings');
  }

  protected logOut() {
    this.accountService.logOut();
  }
}
