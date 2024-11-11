import { Component, inject, input, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  MemberDto,
  TravelClient,
  TravelDto,
  UsersClient,
} from '../../services/api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TravelCardComponent } from '../travel-card/travel-card.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { Router } from '@angular/router';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [
    TravelCardComponent,
    AppButtonComponent,
    AppLoadingComponent,
    AsyncPipe,
  ],
  templateUrl: './travel-list.component.html',
  styleUrl: './travel-list.component.css',
})
export class MyTravelsComponent implements OnInit {
  private router = inject(Router);
  private travelClient = inject(TravelClient);
  public user = input.required<MemberDto>();

  protected isLoading = new BehaviorSubject(false);
  protected travels: TravelDto[] = [];

  async ngOnInit() {
    this.isLoading.next(true);
    const travels = await firstValueFrom(
      this.travelClient.getTravelsByUserId(this.user().id)
    );
    this.travels = travels;
    this.isLoading.next(false);
  }

  protected navigateToTravelDetails(travelId: number) {
    this.router.navigateByUrl('/travel/' + travelId);
  }
}
