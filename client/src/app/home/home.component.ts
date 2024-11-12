import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AccountService } from '../services/account.service';
import { LoginComponent } from '../account/login/login.component';
import { TravelClient, TravelDto } from '../services/api';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { TravelCardComponent } from '../travels/travel-card/travel-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginComponent,
    AppLoadingComponent,
    AsyncPipe,
    TravelCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private router = inject(Router);
  private travelClient = inject(TravelClient);
  protected accountService = inject(AccountService);

  protected isLoading = new BehaviorSubject(false);
  protected travels: TravelDto[] = [];

  public async ngOnInit() {
    this.isLoading.next(true);
    const travels = await firstValueFrom(this.travelClient.getAllTravels());
    if (travels.length > 0) {
      this.travels = travels;
    }
    this.isLoading.next(false);
  }

  protected navigateToTravelDetails(travelId: number) {
    this.router.navigateByUrl('/travel/' + travelId);
  }
}
