import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppDropdownComponent } from '../../shared/components/app-dropdown/app-dropdown.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country';
import { CityService } from '../../services/city.service';
import { City } from '../../models/city';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AppInputTextAreaComponent } from '../../shared/components/app-input-text-area/app-input-text-area.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipModule } from 'primeng/chip';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../../shared/components/app-input-text/app-input-text.component';
import { AppCalendarComponent } from '../../shared/components/app-calendar/app-calendar.component';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  CreateTravelDto,
  FileParameter,
  TravelClient,
  UsersClient,
} from '../../../api';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PhotoService } from '../../services/photo.service';
import { UploadEvent } from '../../interfaces/upload-event';
@Component({
  selector: 'app-travel-add',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppCalendarComponent,
    AppDropdownComponent,
    AppInputTextComponent,
    AppInputTextAreaComponent,
    AppLoadingComponent,
    AsyncPipe,
    ChipModule,
    FileUploadModule,
    FormsModule,
    NgIf,
    NgFor,
    MultiSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './travel-add.component.html',
  styleUrl: './travel-add.component.css',
})
export class TravelAddComponent implements OnInit {
  private accountService = inject(AccountService);
  private cityService = inject(CityService);
  private countryService = inject(CountryService);
  private messageService = inject(MessageService);
  private photoService = inject(PhotoService);
  private router = inject(Router);
  private travelsClient = inject(TravelClient);
  private usersClient = inject(UsersClient);
  protected maxImages: number = 15;
  protected today: Date = new Date();
  protected userId: number;
  protected form = new FormGroup({
    travelCountry: new FormControl<Country>(undefined, [Validators.required]),
    travelCities: new FormControl<string>(undefined),
    travelDates: new FormControl<Date | Date[]>(undefined, [
      Validators.required,
    ]),
    travelDescription: new FormControl<string>(''),
    travelTitel: new FormControl<string>('', [Validators.required]),
  });

  protected countries: Country[] = [];
  protected cities: City[] = [];
  protected uploadedImages: FileParameter[] = [];
  protected isLoading = new BehaviorSubject(false);
  protected isLoadingCities = new BehaviorSubject(false);

  public async ngOnInit() {
    this.isLoading.next(true);

    const username = this.accountService.currentUser().username;
    const user = await firstValueFrom(
      this.usersClient.getUserByUsername(username)
    );
    this.userId = user.id;

    const allCountries = await this.countryService.getAllCountries();
    if (allCountries?.length > 0) {
      this.countries = allCountries;
    }

    this.form.controls.travelCountry.valueChanges.subscribe(async (value) => {
      this.isLoadingCities.next(true);
      this.cities = [];
      this.form.controls.travelCities.setValue(undefined);
      if (value) {
        console.log(value);
        const cities = await this.cityService.getCitiesForCountry(value?.code);
        if (cities.length > 0) {
          this.cities = cities;
        }
      }

      this.isLoadingCities.next(false);
    });

    this.isLoading.next(false);
  }

  protected async createTravel() {
    this.isLoading.next(true);
    const controls = this.form.controls;
    const createTravelDto: CreateTravelDto = new CreateTravelDto({
      cities: controls.travelCities.value?.toString(),
      countryId: controls.travelCountry.value?.id,
      countryIso2Code: controls.travelCountry.value?.code,
      countryName: controls.travelCountry.value?.name,
      description: controls.travelDescription.value,
      endDate: Array.isArray(controls.travelDates.value)
        ? controls.travelDates.value[1]
        : null,
      startDate: Array.isArray(controls.travelDates.value)
        ? controls.travelDates.value[0]
        : null,
      title: controls.travelTitel.value,
      userId: this.userId,
    });

    const newTravelId = await firstValueFrom(
      this.travelsClient.createTravel(createTravelDto)
    );
    await firstValueFrom(
      this.travelsClient.addTravelPhoto(newTravelId, this.uploadedImages)
    );
    this.isLoading.next(false);
    this.router.navigateByUrl('/user-profile');
  }

  protected async onImageUpload(event: UploadEvent) {
    this.isLoading.next(true);
    const totalImages = this.uploadedImages.length + event.files.length;

    if (totalImages > this.maxImages) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Image Limit Exceeded',
        detail: `You can only upload up to ${this.maxImages} images.`,
      });

      event.files.splice(this.maxImages - this.uploadedImages.length);
    }

    if (event?.files?.length > 0) {
      const uploadPromises = event.files.map(async (file) => {
        if (file.name.toLowerCase().endsWith('.heic')) {
          file = await this.photoService.convertHeicToJpeg(file);
        }
        const fileParam: FileParameter = {
          data: file,
          fileName: file.name,
        };
        this.uploadedImages.push(fileParam);
      });

      await Promise.all(uploadPromises);
    }
    this.isLoading.next(false);
  }

  protected clearForm() {
    this.form.reset();
    this.uploadedImages = [];
  }
}
