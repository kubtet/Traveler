import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { TravelClient, TravelDto, UsersClient } from '../services/api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TravelCardComponent } from './travel-card/travel-card.component';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { Router } from '@angular/router';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
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
  templateUrl: './my-travels.component.html',
  styleUrl: './my-travels.component.css',
})
export class MyTravelsComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private travelClient = inject(TravelClient);
  private usersClient = inject(UsersClient);

  protected isLoading = new BehaviorSubject(false);

  protected travels: TravelDto[] = [];
  protected username: string = '';

  protected maxPhotos: number = 5;

  async ngOnInit() {
    this.isLoading.next(true);
    this.username = this.accountService.currentUser().username;
    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(this.username)
    );
    const travels = await firstValueFrom(
      this.travelClient.getTravelsByUserId(user.id)
    );
    this.travels = travels;
    console.log(this.travels);
    this.isLoading.next(false);
  }

  protected navigateToTravelDetails(travelId: number) {
    this.router.navigateByUrl('/travel/' + travelId);
  }
}
