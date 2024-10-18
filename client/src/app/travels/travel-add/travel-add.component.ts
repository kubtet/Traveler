import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AppDropdownComponent } from '../../shared/components/app-dropdown/app-dropdown.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../services/api';
import { map } from 'rxjs';

@Component({
  selector: 'app-travel-add',
  standalone: true,
  imports: [AppDropdownComponent, DropdownModule, FormsModule, NgIf],
  templateUrl: './travel-add.component.html',
  styleUrl: './travel-add.component.css',
})
export class TravelAddComponent implements OnInit {
  private countryService = inject(CountryService);
  protected visitedCountry = new FormControl<Country>(undefined);
  protected countries: Country[] = [];
  countriesNg: any[] | undefined;

  selectedCountry: string | undefined | any;

  public async ngOnInit() {
    this.countriesNg = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' },
    ];

    const allCountries = await this.countryService.getAllCountries();
    this.countries = this.mapCountries(allCountries);
  }

  private mapCountries(allCountries: any) {
    return allCountries.map((country) => {
      return {
        id: country.id,
        name: country.name,
        code: country.iso2,
      };
    });
  }
}
