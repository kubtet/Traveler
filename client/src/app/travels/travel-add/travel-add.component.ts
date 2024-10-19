import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { AppDropdownComponent } from '../../shared/components/app-dropdown/app-dropdown.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country';
import { CityService } from '../../services/city.service';
import { City } from '../../models/city';
import { BehaviorSubject } from 'rxjs';
import { AppLoadingComponent } from '../../shared/components/app-loading/app-loading.component';
import { AppInputTextAreaComponent } from '../../shared/components/app-input-text-area/app-input-text-area.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipModule } from 'primeng/chip';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../../shared/components/app-input-text/app-input-text.component';
import { AppCalendarComponent } from '../../shared/components/app-calendar/app-calendar.component';
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
  ],
  templateUrl: './travel-add.component.html',
  styleUrl: './travel-add.component.css',
})
export class TravelAddComponent implements OnInit {
  private cityService = inject(CityService);
  private countryService = inject(CountryService);
  protected visitedCountry = new FormControl<Country>(undefined);
  protected visitedCity = new FormControl<Country>(undefined);
  protected countries: Country[] = [];
  protected cities: City[] = [];
  protected travelDescription = new FormControl<string>('');
  protected travelDates = new FormControl<Date | Date[]>(undefined);
  protected uploadedImages: any[] = [];
  protected isLoading = new BehaviorSubject(false);

  public async ngOnInit() {
    this.isLoading.next(true);

    const allCountries = await this.countryService.getAllCountries();
    if (allCountries?.length > 0) {
      this.countries = allCountries;
    }

    this.visitedCountry.valueChanges.subscribe(async (value) => {
      this.isLoading.next(true);
      if (value) {
        console.log(value);
        const cities = await this.cityService.getCitiesForCountry(value?.code);
        if (cities.length > 0) {
          this.cities = cities;
        }
      } else {
        this.cities = [];
        this.visitedCity.setValue(undefined);
      }
      this.isLoading.next(false);
    });

    this.isLoading.next(false);
  }
}
