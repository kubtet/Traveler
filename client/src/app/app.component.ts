import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AppButtonComponent } from './shared/components/app-button/app-button.component';
import { AppInputTextComponent } from './shared/components/app-input-text/app-input-text.component';
import { FormControl, Validators } from '@angular/forms';
import { AppCalendarComponent } from './shared/components/app-calendar/app-calendar.component';
import { AppDropdownComponent } from './shared/components/app-dropdown/app-dropdown.component';

interface Country {
  name: string;
  value: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppCalendarComponent,
    RouterOutlet,
    NgFor,
    AppInputTextComponent,
    AppDropdownComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  protected title: string = 'Traveler';
  protected users: any;

  protected max: Date = new Date(2024, 7, 31);
  protected min: Date = new Date(2024, 7, 1);

  protected options: Country[] = [];

  protected control: FormControl = new FormControl<string>('', [
    Validators.required,
  ]);

  protected dropdownControl: FormControl = new FormControl<any>(undefined, [
    Validators.required,
  ]);

  protected date: FormControl = new FormControl<Date | Date[] | undefined>(
    undefined,
    [Validators.required]
  );

  public async ngOnInit() {
    this.users = await firstValueFrom(
      this.http.get('https://localhost:5001/api/users')
    );
    console.log(this.users);

    this.options = [
      { name: 'Argentina', value: '1' },
      { name: 'France', value: '2' },
      { name: 'Croatia', value: '3' },
      { name: 'Morocco', value: '4' },
    ];

    this.control.valueChanges.subscribe((x) => console.log(x));
    this.date.valueChanges.subscribe((x) => console.log(x));
    this.dropdownControl.valueChanges.subscribe((x) => console.log(x));
  }

  public async testMethod() {
    console.log('called');
  }
}
