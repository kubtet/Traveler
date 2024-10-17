import { Component, input } from '@angular/core';
import { TravelDto } from '../../services/api';
import { DatePipe } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-travel-card',
  standalone: true,
  imports: [DatePipe, ImageModule],
  templateUrl: './travel-card.component.html',
  styleUrl: './travel-card.component.css',
})
export class TravelCardComponent {
  public travel = input.required<TravelDto>();
}
