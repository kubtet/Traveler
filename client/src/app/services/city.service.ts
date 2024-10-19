import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { City } from '../models/city';
import { environment } from '../../environments/environment';

@Injectable()
export class CityService {
  private http = inject(HttpClient);
  private url: string = 'https://api.countrystatecity.in/v1/countries/';
  private key: string = environment.countryStateCityKey;

  constructor() {}

  public async getCitiesForCountry(countryIso2Code: string): Promise<City[]> {
    let options: any = {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSCAPI-KEY': this.key,
      }),
    };

    const cities = await firstValueFrom(
      this.http.get(this.url + countryIso2Code + '/cities', options)
    );
    const result = this.mapCities(cities);
    return result;
  }

  private mapCities(cities: any): City[] {
    return cities.map((city: any) => {
      return {
        id: city?.id,
        name: city?.name,
      };
    });
  }
}
