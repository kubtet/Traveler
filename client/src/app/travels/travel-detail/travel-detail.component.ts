import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  AddNotificationDto,
  LikesClient,
  MemberDto,
  TravelClient,
  TravelDetailDto,
  TypeOfNotification,
  UsersClient,
} from '../../services/api';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoModel } from '../../shared/models/photo.model';
import { PhotoService } from '../../services/photo.service';
import { AccountService } from '../../services/account.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UserListModalComponent } from '../../modals/user-list-modal/user-list-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { PresenceService } from '../../services/presence.service';

@Component({
  selector: 'app-travel-detail',
  standalone: true,
  imports: [
    AppLoadingComponent,
    AsyncPipe,
    ConfirmDialogModule,
    DatePipe,
    GalleriaModule,
    SpeedDialModule,
    ToastModule,
    AvatarModule,
    AvatarGroupModule,
    AppButtonComponent,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    MessageService,
  ],
  templateUrl: './travel-detail.component.html',
  styleUrl: './travel-detail.component.css',
})
export class TravelDetailComponent implements OnInit {
  private travelClient = inject(TravelClient);
  private usersClient = inject(UsersClient);
  private presenceService = inject(PresenceService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private photoService = inject(PhotoService);
  private likeService = inject(LikesClient);
  protected accountService = inject(AccountService);
  protected photos: PhotoModel[] = [];
  protected activeIndex: number = 0;
  protected displayCustom: boolean | undefined;
  protected travel: TravelDetailDto;
  protected travelId: number;
  protected creator: MemberDto = new MemberDto();
  protected user: MemberDto = new MemberDto();
  protected isOwnPost: boolean;
  protected isLikedByUser: boolean = false;
  protected isLoading = new BehaviorSubject(false);
  protected isLiked: boolean;
  protected numberOfLikes: number;
  protected items: MenuItem[] = [];
  protected likedBy: MemberDto[];
  protected ref: DynamicDialogRef;

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  goBack() {
    const previousUrl = history?.state?.from;
    this.router.navigateByUrl(previousUrl);
  }

  protected async toggleLike() {
    this.isLoading.next(true);
    await firstValueFrom(this.likeService.toggleLikeTravel(this.travelId));
    this.isLiked = await firstValueFrom(
      this.likeService.isTravelLikedByUser(this.travelId)
    );
    this.numberOfLikes = await firstValueFrom(
      this.likeService.getLikeCountForTravel(this.travelId)
    );
    this.likedBy = await firstValueFrom(
      this.likeService.getUsersWhoLikedTravel(this.travelId)
    );
    if (this.isLiked) {
      const addNotificationDto = new AddNotificationDto({
        notifiedUserId: this.travel.userId,
        travelTitle: this.travel.title,
        notificationType: TypeOfNotification.Liked,
      });
      this.presenceService.addNotification(addNotificationDto);
    }
    this.isLoading.next(false);
  }

  async openUserListModal() {
    this.isLoading.next(true);
    this.likedBy = await firstValueFrom(
      this.likeService.getUsersWhoLikedTravel(this.travelId)
    );
    this.isLoading.next(false);
    this.ref = this.dialogService.open(UserListModalComponent, {
      header: 'Users who liked this post',
      width: '50%',
      data: { usersToDisplay: this.likedBy },
    });
  }

  public async ngOnInit() {
    this.isLoading.next(true);
    this.route.paramMap.subscribe((params) => {
      this.travelId = +params.get('id')!;
    });
    const travel = await firstValueFrom(
      this.travelClient.getTravelDetails(this.travelId)
    );
    if (!travel) {
      this.router.navigateByUrl('/not-found');
    }
    this.travel = travel;
    this.photos = this.photoService.castPhotosToPhotoModel(
      this.travel.photoUrls
    );

    const creator = await firstValueFrom(
      this.usersClient.getUserById(this.travel.userId)
    );
    if (creator) {
      this.creator = creator;
    }

    this.numberOfLikes = await firstValueFrom(
      this.likeService.getLikeCountForTravel(this.travel.id)
    );

    this.isLikedByUser = await firstValueFrom(
      this.likeService.isTravelLikedByUser(this.travel.id)
    );

    this.isLiked = await firstValueFrom(
      this.likeService.isTravelLikedByUser(this.travelId)
    );

    this.likedBy = await firstValueFrom(
      this.likeService.getUsersWhoLikedTravel(this.travelId)
    );

    this.isLoading.next(false);
    this.checkIfOwnPost();

    this.items = [
      {
        icon: 'pi pi-pencil',
        command: () => {},
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          this.removeTravel();
        },
      },
    ];
  }

  protected async checkIfOwnPost() {
    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(
        this.accountService.currentUser().username
      )
    );
    if (user) {
      this.user = user;
    }
    this.isOwnPost = this.user.id === this.travel.userId;
  }

  protected scrollToGallery() {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected goToUserProfile() {
    this.router.navigateByUrl('/user-profile/' + this.travel.userId.toString());
  }

  protected removeTravel() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove this travel permanently?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.isLoading.next(true);
        await firstValueFrom(this.travelClient.removeTravel(this.travelId));
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Travel removed',
        });
        this.goToUserProfile();
        this.isLoading.next(false);
      },
    });
  }
}
