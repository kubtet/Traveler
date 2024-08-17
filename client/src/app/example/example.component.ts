import { Component, OnInit } from '@angular/core';
import { AppButtonComponent } from '../shared/components/app-button/app-button.component';
import { AppInputTextComponent } from '../shared/components/app-input-text/app-input-text.component';
import { AppCalendarComponent } from '../shared/components/app-calendar/app-calendar.component';
import { AppDropdownComponent } from '../shared/components/app-dropdown/app-dropdown.component';
import { FormControl } from '@angular/forms';

interface Country {
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
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class ExampleComponent implements OnInit {
  protected control: FormControl = new FormControl<string>('');
  protected dropdownControl: FormControl = new FormControl();
  protected date: FormControl = new FormControl<Date | undefined>(undefined);

  protected options: Country[] = [
    { name: 'Argentina', value: 1 },
    { name: 'France', value: 2 },
    { name: 'Croatia', value: 3 },
    { name: 'Morocco', value: 4 },
  ];

  public ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.dropdownControl.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.date.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  public consoleLog() {
    console.log(this.dropdownControl.value);
  }
}
