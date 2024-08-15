import { NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarModule, NgIf, ReactiveFormsModule],
  templateUrl: './app-calendar.component.html',
  styleUrl: './app-calendar.component.css',
})
export class AppCalendarComponent implements OnChanges {
  /** Form control of the component. */
  @Input() public control?: FormControl<Date | Date[]>;

  /** Format of the date which can also be defined at locale settings. */
  @Input() public dateFormat: string = 'dd/mm/yy';

  /** Identifier of the focus input to match a label defined for the component. */
  @Input() public inputId: string = '';

  /** Inline style of the input field. */
  @Input() public inputStyle: any;

  /** Label of the component. */
  @Input() public label: string = '';

  /** The maximum selectable date. */
  @Input() public maxDate?: Date;

  /** The minimum selectable date. */
  @Input() public minDate?: Date;

  /** When present, it specifies that an input field must be filled out before submitting the form. */
  @Input() public required: boolean = false;

  /** Defines the quantity of the selection, valid values are "single", "multiple" and "range". */
  @Input() public selectionMode: 'multiple' | 'range' | 'single' = 'single';

  /** Whether to display today and clear buttons at the footer. */
  @Input() public showButtonBar: boolean = false;

  /** When enabled, a clear icon is displayed to clear the value. */
  @Input() public showClear: boolean = true;

  /** When enabled, displays a button with icon next to input. */
  @Input() public showIcon: boolean = true;

  /** When disabled, datepicker will not be visible with input focus. */
  @Input() public showOnFocus: boolean = false;

  /** Inline style of the component. */
  @Input() public style: any;

  /** Style class of the component. */
  @Input() public styleClass: string = '';

  public async ngOnChanges() {
    if (this.control) {
      this.required = this.control.hasValidator(Validators.required);
    }

    if (!this.inputId) {
      this.inputId = this.label;
    }
  }
}
