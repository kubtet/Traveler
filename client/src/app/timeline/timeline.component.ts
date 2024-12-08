import { Component, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent implements OnInit {
  public dates = input.required<String[]>();
  

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
