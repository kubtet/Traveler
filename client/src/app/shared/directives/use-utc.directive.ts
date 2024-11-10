import { Directive, Host, HostListener, Self } from '@angular/core';
import { Calendar } from 'primeng/calendar';

@Directive({
  selector: '[useUtc]',
  standalone: true,
})
export class UseUtcDirective {
  constructor(@Host() @Self() private calendar: Calendar) {}

  @HostListener('onSelect', ['$event']) onSelect() {
    this.toUtc();
  }

  @HostListener('onInput', ['$event']) onInput() {
    this.toUtc();
  }

  private toUtc() {
    if (Array.isArray(this.calendar.value)) {
      const startDate = new Date(
        Date.UTC(
          this.calendar.value[0].getFullYear(),
          this.calendar.value[0].getMonth(),
          this.calendar.value[0].getDate()
        )
      );

      const endDate = this.calendar.value[1]
        ? new Date(
            Date.UTC(
              this.calendar.value[1].getFullYear(),
              this.calendar.value[1].getMonth(),
              this.calendar.value[1].getDate()
            )
          )
        : null;

      this.calendar.value = [startDate, endDate];
    } else if (this.calendar.value instanceof Date) {
      this.calendar.value = new Date(
        Date.UTC(
          this.calendar.value.getFullYear(),
          this.calendar.value.getMonth(),
          this.calendar.value.getDate()
        )
      );
    }

    this.calendar.updateModel(this.calendar.value);
  }
}
