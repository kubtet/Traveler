import { Component, OnInit, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccountService } from '../services/account.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import {
  AddNotificationDto,
  FollowsClient,
  MemberDto,
  TypeOfNotification,
  UsersClient,
} from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelListComponent } from '../travels/travel-list/travel-list.component';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';
import { StatisticsComponent } from '../statistics/statistics.component';
import { MapComponent } from '../map/map.component';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserListModalComponent } from '../modals/user-list-modal/user-list-modal.component';
import { PresenceService } from '../services/presence.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    TravelListComponent,
    AppLoadingComponent,
    StatisticsComponent,
    MapComponent,
    DynamicDialogModule,
    SpeedDialModule,
    ConfirmDialogModule,
  ],
  templateUrl: './user-profile.component.html',
  providers: [ConfirmationService, DialogService, MessageService],
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);
  private presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersClient = inject(UsersClient);
  protected followsClient = inject(FollowsClient);
  protected accountService = inject(AccountService);
  protected isCurrent: boolean = false;
  protected isLoading = new BehaviorSubject(false);
  protected userId: number = 0;
  protected user: MemberDto;
  protected currentUser: MemberDto;
  protected numberOfFollowers: number;
  protected numberOfFollowings: number;
  protected isFollowedByCurrent: boolean;

  protected items: MenuItem[] | undefined;
  protected ref: DynamicDialogRef;

  // User lists
  protected followers: MemberDto[] = [];
  protected followings: MemberDto[] = [];

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

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

      this.numberOfFollowers = await firstValueFrom(
        this.followsClient.countFollowers(this.user.id)
      );
      this.isFollowedByCurrent = await firstValueFrom(
        this.followsClient.isFollowedByCurrentStatus(this.user.id)
      );
      this.currentUser = await firstValueFrom(
        this.usersClient.getUserByUsername(
          this.accountService.currentUser().username
        )
      );
      this.numberOfFollowings = await firstValueFrom(
        this.followsClient.countFollowings(this.user.id)
      );

      this.items = [
        {
          icon: 'pi pi-pencil',
          command: () => {
            this.router.navigateByUrl('/settings');
          },
        },
        {
          icon: 'pi pi-sign-out',
          command: () => {
            this.accountService.logOut();
          },
        },
        {
          icon: 'pi pi-trash',
          command: () => {
            this.confirmationService.confirm({
              message:
                'Are you sure that you want to delete your account permanently?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              acceptIcon: 'none',
              rejectIcon: 'none',
              rejectButtonStyleClass: 'p-button-text',
              accept: async () => {
                this.isLoading.next(true);
                await firstValueFrom(this.usersClient.deleteUser(this.userId));
                this.accountService.logOut();
                this.isLoading.next(false);
              },
            });
          },
        },
      ];
      this.isLoading.next(false);
    });
  }

  protected async toggleFollow() {
    this.isLoading.next(true);

    await firstValueFrom(this.followsClient.toggleFollow(this.userId));
    this.numberOfFollowers = await firstValueFrom(
      this.followsClient.countFollowers(this.user.id)
    );
    this.isFollowedByCurrent = await firstValueFrom(
      this.followsClient.isFollowedByCurrentStatus(this.user.id)
    );
    if (this.isFollowedByCurrent) {
      const addNotificationDto = new AddNotificationDto({
        notifiedUserId: this.userId,
        notificationType: TypeOfNotification.Followed,
      });
      this.presenceService.addNotification(addNotificationDto);
    }
    this.isLoading.next(false);
  }

  async showFollowersDialog() {
    this.isLoading.next(true);
    await this.loadFollowers();
    this.isLoading.next(false);

    this.ref = this.dialogService.open(UserListModalComponent, {
      header: 'Followers',
      width: '50%',
      data: { usersToDisplay: this.followers },
    });
  }
  
  protected async loadFollowers() {
    const newFollowers = await firstValueFrom(
      this.followsClient.getFollowers(this.userId)
    );
    this.followers = newFollowers;
  }

  protected async loadFollowing() {
    const newFollowings = await firstValueFrom(
      this.followsClient.getFollowing(this.userId)
    );
    this.followings = newFollowings;
  }

  async showFollowingDialog() {
    this.isLoading.next(true);
    await this.loadFollowing();
    this.isLoading.next(false);
    this.ref = this.dialogService.open(UserListModalComponent, {
      header: 'Following',
      width: '50%',
      data: { usersToDisplay: this.followings },
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

  protected goToUserProfile(userId: number) {
    this.router.navigateByUrl(`/user-profile/${userId}`);
  }

  protected logOut() {
    this.accountService.logOut();
  }
}
