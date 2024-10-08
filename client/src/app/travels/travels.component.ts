import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { TravelClient, TravelDto, UsersClient } from '../services/api';
import { firstValueFrom } from 'rxjs';
import { CardModule } from 'primeng/card';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [CardModule, AppButtonComponent, DatePipe, NgIf, NgFor],
  templateUrl: './travels.component.html',
  styleUrl: './travels.component.css',
})
export class TravelsComponent implements OnInit {
  private accountService = inject(AccountService);
  private travelClient = inject(TravelClient);
  private usersClient = inject(UsersClient);

  protected travels: TravelDto[] = [];
  protected username: string = '';

  protected maxPhotos: number = 5;

  async ngOnInit() {
    this.username = this.accountService.currentUser().username;
    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(this.username)
    );
    const travels = await firstValueFrom(
      this.travelClient.getTravelsById(user.id)
    );
    this.travels = travels;
    console.log(travels);

    this.travels[0].photosUrl.pop();
    this.travels[0].photosUrl.pop();
    this.travels[0].photosUrl.push('https://picsum.photos/seed/picsum/200/300');
  }

  protected displayedPhotos(travel: TravelDto): string[] {
    return travel.photosUrl.slice(0, this.maxPhotos);
  }
}
