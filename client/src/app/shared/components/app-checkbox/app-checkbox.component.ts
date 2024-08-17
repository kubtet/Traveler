import { NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CheckboxModule, NgIf, ReactiveFormsModule],
  templateUrl: './app-checkbox.component.html',
  styleUrl: './app-checkbox.component.css',
})
export class AppCheckboxComponent implements OnChanges {
  /** Form control value. */
  @Input() public control?: FormControl<any>;

  /** Identifier of the focus input to match a label defined for the component. */
  @Input() public inputId: string = '';

  /** Label of the checkbox. */
  @Input() public label: string = '';

  /** LName of the checkbox group. */
  @Input() public name: string = '';

  /** When present, it specifies that checkbox must be checked before submitting the form. */
  @Input() public required: boolean = false;

  /** Value of the checkbox. */
  @Input() public value: any;

  public ngOnChanges() {
    if (this.control) {
      this.required = this.control.hasValidator(Validators.required);
    }

    if (!this.inputId) {
      this.inputId = this.label;
    }
  }
}
