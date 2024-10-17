import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountryService {
  private http = inject(HttpClient);
  private url: string = 'https://api.countrystatecity.in/v1/countries';

  constructor() {}

  public async getAllCountries() {
    let options: any = {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSCAPI-KEY': 'API_KEY',
      }),
    };

    const result = await firstValueFrom(this.http.get(this.url, options));
    console.log(result);
  }
}
