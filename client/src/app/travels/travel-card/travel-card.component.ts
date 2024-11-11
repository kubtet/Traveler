import { Component, inject, input, OnInit } from '@angular/core';
import { MemberDto, TravelDto, UsersClient } from '../../services/api';
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
  protected user: MemberDto = new MemberDto();
  public travel = input.required<TravelDto>();
  public profilePhotoDisplay = input.required<boolean>();

  public async ngOnInit() {
    if (this.profilePhotoDisplay()) {
      this.user = await firstValueFrom(
        this.usersClient.getUserById(this.travel().userId)
      );
    }
  }
}
