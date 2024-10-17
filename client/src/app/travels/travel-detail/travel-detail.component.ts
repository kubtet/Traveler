import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TravelClient, TravelDetailDto } from '../../services/api';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoModel } from '../../shared/models/photo.model';
import { PhotoService } from '../../services/photo.service';

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
  private photoService = inject(PhotoService);
  private travelClient = inject(TravelClient);
  protected photos: PhotoModel[] = [];
  protected travel: TravelDetailDto;
  protected travelId: number;
  protected isLoading = new BehaviorSubject(false);

  public async ngOnInit() {
    this.isLoading.next(true);
    this.route.paramMap.subscribe((params) => {
      this.travelId = +params.get('id')!;
    });
    const travel = await firstValueFrom(
      this.travelClient.getTravelDetails(this.travelId)
    );
    this.travel = travel;
    this.photos = this.photoService.castPhotosToPhotoModel(
      this.travel.photoUrls
    );
    this.isLoading.next(false);
  }
}
