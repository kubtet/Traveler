import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AccountService } from '../services/account.service';
import { LoginComponent } from '../account/login/login.component';
import { PaginatedResponseOfTravelDto, TravelClient } from '../services/api';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';
import { TravelCardComponent } from '../travels/travel-card/travel-card.component';
import { Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { PageUrl } from '../enums/PageUrl';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginComponent,
    AppLoadingComponent,
    AsyncPipe,
    TravelCardComponent,
    PaginatorModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private router = inject(Router);
  private travelClient = inject(TravelClient);
  protected accountService = inject(AccountService);
  protected pageNumber: number = 1;
  protected pageSize: number = 15;
  protected isLoading = new BehaviorSubject(false);
  protected travels: PaginatedResponseOfTravelDto =
    new PaginatedResponseOfTravelDto();
  protected travelCache = new Map();

  public async ngOnInit() {
    await this.loadTravels();
  }

  protected async loadTravels() {
    this.isLoading.next(true);
    const response = this.travelCache.get(
      this.pageNumber + '-' + this.pageSize
    );
    if (response) {
      this.isLoading.next(false);
      return this.setResponse(response);
    }

    const listOfTravels = await firstValueFrom(
      this.travelClient.getAllTravels(
        null,
        null,
        null,
        this.pageNumber,
        this.pageSize
      )
    );
    if (listOfTravels?.items?.length > 0) {
      this.setResponse(listOfTravels);
      this.travelCache.set(
        this.pageNumber + '-' + this.pageSize,
        listOfTravels
      );
    }
    this.isLoading.next(false);
  }

  protected navigateToTravelDetails(travelId: number) {
    this.router.navigateByUrl('/travel/' + travelId, {
      state: { from: PageUrl.HOME },
    });
  }

  protected async onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    await this.loadTravels();
  }

  private setResponse(listOfTravels: PaginatedResponseOfTravelDto) {
    this.travels = listOfTravels;
  }
}
