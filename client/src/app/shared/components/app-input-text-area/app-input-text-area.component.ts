import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-input-text-area',
  standalone: true,
  imports: [
    InputTextareaModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './app-input-text-area.component.html',
  styleUrl: './app-input-text-area.component.css',
})
export class AppInputTextAreaComponent implements OnChanges {
  /** When present, textarea size changes as being typed. */
  @Input() public autoResize?: boolean = false;

  /** Number of character columns of the textarea. */
  @Input() public cols: number = 30;

  /** Used to bind the component to a form control. */
  @Input() public control?: FormControl<string>;

  /** When present, it specifies that the element value cannot be altered. */
  @Input() public disabled: boolean = false;

  /** Identifier of the focus input to match a label defined for the component. */
  @Input() public id: string = '';

  /** Label of the component. */
  @Input() public label: string = '';

  /** Advisory information to display on input. */
  @Input() public placeholder: string = '';

  /** When present, it specifies that the size of an input textarea can be manually modified. */
  @Input() public resizable: boolean = false;

  /** When present, it specifies that an input field must be filled out before submitting the form. */
  @Input() public required: boolean = false;

  /** Number of character rows of the textarea. */
  @Input() public rows: number = 5;

  /** Value of the component. */
  @Input() public value?: string;

  public async ngOnChanges() {
    if (!this.id) {
      this.id = this.label;
    }

    if (this.control) {
      this.required = this.control.hasValidator(Validators.required);
    }
  }
}
