import { Component, inject, input, OnInit } from '@angular/core';
import { MemberDto, TravelDto, UsersClient, LikesClient } from '../../../api';
import { DatePipe } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-travel-card',
  standalone: true,
  imports: [DatePipe, ImageModule],
  templateUrl: './travel-card.component.html',
  styleUrl: './travel-card.component.css',
})
export class TravelCardComponent implements OnInit {
  private usersClient = inject(UsersClient);
  private likesClient = inject(LikesClient);
  protected numberOfLikes: number;
  protected user: MemberDto = new MemberDto();
  public travel = input.required<TravelDto>();
  public profilePhotoDisplay = input.required<boolean>();

  public async ngOnInit() {
    if (this.profilePhotoDisplay()) {
      this.user = await firstValueFrom(
        this.usersClient.getUserById(this.travel().userId)
      );
    }
    this.numberOfLikes = await firstValueFrom(
      this.likesClient.getLikeCountForTravel(this.travel().id)
    );
  }
}
