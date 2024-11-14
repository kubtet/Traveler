import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  LikesClient,
  MemberDto,
  TravelClient,
  TravelDetailDto,
  UsersClient,
} from '../../services/api';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoModel } from '../../shared/models/photo.model';
import { PhotoService } from '../../services/photo.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-travel-detail',
  standalone: true,
  imports: [
    AppLoadingComponent,
    AsyncPipe,
    AppButtonComponent,
    DatePipe,
    GalleriaModule,
  ],
  templateUrl: './travel-detail.component.html',
  styleUrl: './travel-detail.component.css',
})
export class TravelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private photoService = inject(PhotoService);
  private travelClient = inject(TravelClient);
  private usersClient = inject(UsersClient);
  private likeService = inject(LikesClient);
  protected accountService = inject(AccountService);
  protected photos: PhotoModel[] = [];
  protected travel: TravelDetailDto;
  protected travelId: number;
  protected creator: MemberDto = new MemberDto();
  protected user: MemberDto = new MemberDto();
  protected isOwnPost: boolean;
  protected isLikedByUser: boolean = false;
  protected isLoading = new BehaviorSubject(false);
  protected isLiked;
  protected numberOfLikes: number;

  protected async toggleLike() {
    this.isLoading.next(true);
    await firstValueFrom(this.likeService.toggleLikeTravel(this.travelId));
    this.isLiked = await firstValueFrom(
      this.likeService.isTravelLikedByUser(this.travelId)
    );
    this.numberOfLikes = await firstValueFrom(
      this.likeService.getLikeCountForTravel(this.travelId)
    );
    this.isLoading.next(false);
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

    this.isLoading.next(false);
    this.checkIfOwnPost();
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
}
