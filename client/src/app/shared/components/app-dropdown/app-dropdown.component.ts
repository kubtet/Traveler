import { NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [DropdownModule, NgIf, ReactiveFormsModule],
  templateUrl: './app-dropdown.component.html',
  styleUrl: './app-dropdown.component.css',
})
export class AppDropdownComponent implements OnChanges {
  /** Used to bind the component to a form control. */
  @Input() public control?: FormControl<any>;

  /** When enabled, a flag for specified country is displayed along with name. */
  @Input() public countries: boolean = false;

  /** Identifier of the accessible input element. */
  @Input() public inputId: string = '';

  /** When specified, displays an input field to filter the items on keyup. */
  @Input() public filter: boolean = false;

  /** When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. */
  @Input() public filterBy: string = '';

  /** Label of the component. */
  @Input() public label: string = '';

  /** Name of the label field of an option. */
  @Input() public optionLabel: string = '';

  /** Name of the value field of an option. */
  @Input() public optionValue: string = '';

  /** An array of objects to display as the available options. */
  @Input() public options: any[] = [];

  /** Default text to display when no option is selected. */
  @Input() public placeholder: string = '';

  /** When present, it specifies that an input field must be filled out before submitting the form. */
  @Input() public required: boolean = false;

  /** When enabled, a clear icon is displayed to clear the value. */
  @Input() public showClear: boolean = true;

  public async ngOnChanges() {
    if (!this.inputId) {
      this.inputId = this.label;
    }

    if (this.control) {
      this.required = this.control.hasValidator(Validators.required);
    }
  }
}
