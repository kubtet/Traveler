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

  public async ngOnInit() {
    await this.loadTravels();
  }

  protected async loadTravels() {
    this.isLoading.next(true);
    const listOfTravels = await firstValueFrom(
      this.travelClient.getAllTravels(this.pageNumber, this.pageSize)
    );
    if (listOfTravels?.items?.length > 0) {
      this.travels = listOfTravels;
    }
    this.isLoading.next(false);
  }

  protected navigateToTravelDetails(travelId: number) {
    this.router.navigateByUrl('/travel/' + travelId);
  }

  protected async onPageChange(event: any) {
    this.pageNumber = event.page + 1; 
    this.pageSize = event.rows;
    await this.loadTravels();
  }
}
