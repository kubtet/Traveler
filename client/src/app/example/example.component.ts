import { Component, inject, OnInit } from '@angular/core';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { AppCalendarComponent } from '../shared/components/app-calendar/app-calendar.component';
import { AppDropdownComponent } from '../shared/components/app-dropdown/app-dropdown.component';
import { FormControl, FormsModule } from '@angular/forms';
import { AppCheckboxComponent } from '../shared/components/app-checkbox/app-checkbox.component';
import { Country, CountryClient } from '../../api';
import { firstValueFrom } from 'rxjs';
import { NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CountryService } from '../services/country.service';

interface CountryPrimeNg {
  name: string;
  value: number;
}

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppInputTextComponent,
    AppCalendarComponent,
    AppDropdownComponent,
    AppCheckboxComponent,
    NgIf,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class ExampleComponent implements OnInit {
  private countryClient = inject(CountryClient);
  private countryService = inject(CountryService);
  protected control: FormControl = new FormControl<string>('');
  protected checkboxControl: FormControl = new FormControl();
  protected dropdownControl: FormControl = new FormControl();
  protected date: FormControl = new FormControl<Date | undefined>(undefined);
  protected countries: Country[] = [];
  protected selectedCountry: Country;

  protected options: CountryPrimeNg[] = [
    { name: 'Argentina', value: 1 },
    { name: 'France', value: 2 },
    { name: 'Croatia', value: 3 },
    { name: 'Morocco', value: 4 },
  ];

  public async ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.checkboxControl.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.dropdownControl.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.date.valueChanges.subscribe((value) => {
      console.log(value);
    });

    const countries = await firstValueFrom(
      this.countryClient.getAllCountries()
    );
    this.countries = countries;

    this.countryService.getAllCountries();
  }

  public consoleLog() {
    console.log(this.dropdownControl.value);
  }
}
