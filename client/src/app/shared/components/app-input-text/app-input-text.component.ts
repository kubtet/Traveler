import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AppTooltipPosition } from '../../enums/AppTooltipPosition';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    NgClass,
    NgIf,
    PasswordModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  templateUrl: './app-input-text.component.html',
  styleUrl: './app-input-text.component.css',
})
export class AppInputTextComponent implements OnChanges {
  @Input() public maxLength: number = 100; // Default maxLength
  /** Used to bind the component to a form control. */
  @Input() public control?: FormControl<string>;

  /** When present, it specifies that the element value cannot be altered. */
  @Input() public disabled: boolean = false;

  /** Identifier of the focus input to match a label defined for the component. */
  @Input() public id: string = '';

  /** Style class of the input. */
  @Input() public inputClass: string = '';

  /** Inline style of the input. */
  @Input() public inputStyle: any;

  /** If enabled input behaves as the password input. */
  @Input() public isPassword: boolean;

  /** Label of the component. */
  @Input() public label: string = '';

  /** Style class of the label. */
  @Input() public labelClass: string = '';

  /** Inline style of the label. */
  @Input() public labelStyle: any;

  /** Advisory information to display on input. */
  @Input() public placeholder: string = '';

  /** When present, it specifies that an input field is read-only. */
  @Input() public readonly: boolean = false;

  /** When present, it specifies that an input field must be filled out before submitting the form. */
  @Input() public required: boolean = false;

  /** Size of the component, valid values are "small" and "large". */
  @Input() public size: string = '';

  /** Tooltip text of the input text. */
  @Input() public tooltip: string = '';

  /** Position of the tooltip. */
  @Input() public tooltipPos: AppTooltipPosition = AppTooltipPosition.RIGHT;

  /** Value of the component. */
  @Input() public value?: string;

  /** Callback to invoke when the component loses focus. */
  @Output() public onBlur: EventEmitter<FocusEvent> =
    new EventEmitter<FocusEvent>();

  /** Callback to invoke when the component receives focus. */
  @Output() public onFocus: EventEmitter<FocusEvent> =
    new EventEmitter<FocusEvent>();

  /** Callback to invoke when a value is changed. */
  @Output() public onChange: EventEmitter<Event> = new EventEmitter<Event>();

  /** Callback to invoke when a value is changed. */
  @Output() public valueChange: EventEmitter<string> =
    new EventEmitter<string>();

  /** Callback to invoke when enter key is pressed. */
  @Output() public enterPressed = new EventEmitter<string>();

  /**  Method to handle the changes. */
  public ngOnChanges(): void {
    if (this.control) {
      this.control.setValidators([Validators.maxLength(this.maxLength)]);
      this.required = this.control.hasValidator(Validators.required);
    }

    if (!this.id) {
      this.id = this.label;
    }
  }

  /** Method to invoke when the component loses focus. */
  public onBlurMethod(event: FocusEvent): void {
    this.onBlur.emit(event);
  }

  /** Method to invoke when the component receives focus. */
  public onFocusMethod(event: FocusEvent): void {
    this.onFocus.emit(event);
  }

  /** Method to invoke when a value is changed. */
  public onChangeMethod(event: Event): void {
    this.onChange.emit(event);
  }

  /** Method to invoke when a value is changed. */
  public valueChangeMethod(value: string): void {
    this.valueChange.emit(value);
  }

  /** Method to invoke when enter is pressed. */
  public onEnterKey() {
    this.enterPressed.emit();
  }
}
