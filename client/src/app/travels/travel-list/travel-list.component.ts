import { Component, inject, input, OnInit } from '@angular/core';
import {
  MemberDto,
  PaginatedResponseOfTravelDto,
  TravelClient,
} from '../../../api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TravelCardComponent } from '../travel-card/travel-card.component';
import { Router } from '@angular/router';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';
import { PageUrl } from '../../enums/PageUrl';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [TravelCardComponent, AppLoadingComponent, AsyncPipe],
  templateUrl: './travel-list.component.html',
  styleUrl: './travel-list.component.css',
})
export class MyTravelsComponent implements OnInit {
  private router = inject(Router);
  private travelClient = inject(TravelClient);
  public user = input.required<MemberDto>();

  protected isLoading = new BehaviorSubject(false);
  protected travels: PaginatedResponseOfTravelDto =
    new PaginatedResponseOfTravelDto();

  async ngOnInit() {
    this.isLoading.next(true);
    const travels = await firstValueFrom(
      this.travelClient.getTravelsByUserId(this.user().id)
    );
    this.travels = travels;
    this.isLoading.next(false);
  }

  protected navigateToTravelDetails(travelId: number) {
    const url = PageUrl.USER_PROFILE + this.user().id;
    this.router.navigateByUrl('/travel/' + travelId, {
      state: { from: url },
    });
  }
}
