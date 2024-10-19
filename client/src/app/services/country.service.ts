import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Country } from '../models/country';
import { environment } from '../../environments/environment';

@Injectable()
export class CountryService {
  private http = inject(HttpClient);
  private url: string = 'https://api.countrystatecity.in/v1/countries';
  private key: string = environment.countryStateCityKey;
  private countries: Country[] = [];

  constructor() {}

  public async getAllCountries(): Promise<Country[]> {
    if (this.countries.length === 0) {
      const countries = await this.getCountries();
      if (countries) {
        this.countries = countries;
      }
    }

    return this.countries;
  }

  private async getCountries(): Promise<Country[]> {
    let options: any = {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSCAPI-KEY': this.key,
      }),
    };

    const countries = await firstValueFrom(this.http.get(this.url, options));
    const result = this.mapCountries(countries);
    return result;
  }

  private mapCountries(allCountries: any): Country[] {
    return allCountries.map((country: any) => {
      return {
        id: country?.id,
        name: country?.name,
        code: country?.iso2,
      };
    });
  }
}
