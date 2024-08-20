import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonIconPosition } from '../../enums/ButtonIconPosition';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.css',
})
export class AppButtonComponent {
  /** Used to define a string that autocomplete attribute the current element. */
  @Input() public ariaLabel: string = '';

  /** When present, it specifies that the component should automatically get focus on load. */
  @Input() public autofocus: boolean = false;

  /** Value of the badge. */
  @Input() public badge: string = '';

  /** Style class of the badge. */
  @Input() public badgeClass: string = '';

  /** When present, it specifies that the component should be disabled. */
  @Input() public disabled: boolean = false;

  /** Name of the icon. */
  @Input() public icon: string = '';

  /** Position of the icon. */
  @Input() public iconPos: ButtonIconPosition = ButtonIconPosition.LEFT;

  /** Uses to pass attributes to the label's DOM element. */
  @Input() public label: string = '';

  /** Add a link style to the button.. */
  @Input() public link: boolean = false;

  /** Whether the button is in loading state. */
  @Input() public loading: boolean = false;

  /** Icon to display in loading state. */
  @Input() public loadingIcon: string = '';

  /** Add a border class without a background initially. */
  @Input() public outlined: boolean = false;

  /** Add a plain textual class to the button without a background initially. */
  @Input() public plain: boolean = false; // check if necessary

  /** Add a shadow to indicate elevation. */
  @Input() public raised: boolean = false;

  /** Add a circular border radius to the button. */
  @Input() public rounded: boolean = false;

  /** Defines the style of the button. */
  @Input() public severity:
    | 'success'
    | 'info'
    | 'warning'
    | 'primary'
    | 'help'
    | 'danger'
    | 'secondary'
    | 'contrast' = 'primary';

  /** Defines the size of the button. */
  @Input() public size?: 'small' | 'large' = undefined;

  /** Inline style of the element. */
  @Input() public style?: Object = undefined;

  /** Class of the element. */
  @Input() public styleClass: string = '';

  /** Add a tabindex to the button. */
  @Input() public tabindex?: number = undefined; // check if necessary

  /** Add a textual class to the button without a background initially. */
  @Input() public text: boolean = false;

  /** Type of the button. */
  @Input() public type: string = 'button'; // check if necessary

  /** Callback to execute when button is clicked. */
  @Output() public onClick: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();

  /** Method to execute when button is clicked. */
  public onClickMethod(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.onClick.emit(event);
  }
}
