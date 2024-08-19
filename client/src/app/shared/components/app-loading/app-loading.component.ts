import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [ProgressSpinnerModule, NgIf, NgClass],
  templateUrl: './app-loading.component.html',
  styleUrl: './app-loading.component.css',
})
export class AppLoadingComponent {
  /** If enabled then the loading indicator is in active state. */
  @Input() public isLoading: boolean = false;

  /** If enabled then the loading indicator is overlaying the content of the page. */
  @Input() public isOverlay: boolean = false;
}
