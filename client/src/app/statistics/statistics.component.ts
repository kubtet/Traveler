import { Component, OnInit, inject, input } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  CountriesByContinentDto,
  MonthyTripsDto,
  SeasonalTravelsDto,
  StatisticsClient,
  TravelTimelineDto,
  UserStatisticsDto,
} from '../services/api';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { AppLoadingComponent } from '../shared/components/app-loading/app-loading.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    PanelModule,
    TimelineModule,
    DatePipe,
    ProgressBarModule,
    ToastModule,
    ChartModule,
    AppLoadingComponent,
    AsyncPipe,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  public userId = input.required<number>();
  private statisticsClient = inject(StatisticsClient);
  protected statistics: UserStatisticsDto = null;
  protected travelsTimeline: TravelTimelineDto[] = null;
  protected monthlyTravels: MonthyTripsDto[] = null;
  protected seasonalTravels: SeasonalTravelsDto = null;
  protected countriesByContinent: CountriesByContinentDto = null;
  protected COUNTRIES_IN_CONTINENTS: { [key: string]: number } = {
    Africa: 54,
    Asia: 49,
    Europe: 44,
    NorthAmerica: 23,
    SouthAmerica: 12,
    Oceania: 14,
  };
  protected totalCountries = Object.values(this.COUNTRIES_IN_CONTINENTS).reduce(
    (sum, count) => sum + count,
    0
  );
  // seasonal plot
  protected basicSeasonData: any;
  protected basicSeasonOptions: any;
  // activity plot
  protected monthlyPlotTripsData: any;
  protected monthlyPlotTripsOptions: any;
  protected startDateActivity: Date | null;
  protected endDateActivity: Date | null;
  protected monthlyTripsLabels: String[] = [];
  protected monthlyTripsData: Number[] = [];
  protected isLoading = new BehaviorSubject(false);

  public seenCountriesShare = 0; // percentage of visited countries
  public continentsProgress: {
    name: string;
    visited: number;
    total: number;
    progress: number;
  }[];

  public async ngOnInit() {
    this.isLoading.next(true);
    this.statistics = await firstValueFrom(
      this.statisticsClient.getStatisticsForUser(this.userId())
    );
    this.travelsTimeline = await firstValueFrom(
      this.statisticsClient.getTravelsTimeline(this.userId())
    );
    this.monthlyTravels = await firstValueFrom(
      this.statisticsClient.getMonthlyTrips(this.userId())
    );
    this.seasonalTravels = await firstValueFrom(
      this.statisticsClient.getSeasonalTrips(this.userId())
    );
    this.countriesByContinent = await firstValueFrom(
      this.statisticsClient.getCountriesByContinent(this.userId())
    );
    this.seenCountriesShare = Math.round(
      (this.statistics.totalCountries / this.totalCountries) * 100
    );

    this.continentsProgress = Object.entries(this.COUNTRIES_IN_CONTINENTS).map(
      ([continent, total]) => {
        const countriesByContinentJSON = JSON.parse(
          JSON.stringify(this.countriesByContinent)
        );
        const visited = countriesByContinentJSON[`countries${continent}`] || 0;
        const progress = Math.round((visited / total) * 100);
        return {
          name: continent,
          visited: visited,
          total: total,
          progress,
        };
      }
    );

    this.startDateActivity = this.monthlyTravels[0]?.date;
    this.endDateActivity =
      this.monthlyTravels[this.monthlyTravels.length - 1]?.date;

    const { labels, data } = this.generateLabelsAndDataForMonths(
      this.startDateActivity,
      this.endDateActivity,
      this.monthlyTravels
    );

    this.monthlyTripsLabels = labels;
    this.monthlyTripsData = data;

    this.basicSeasonData = {
      labels: ['Winter', 'Spring', 'Summer', 'Autumn'],
      datasets: [
        {
          label: 'Trips by seasons',
          data: [
            this.seasonalTravels.totalTravelsWinter,
            this.seasonalTravels.totalTravelsSpring,
            this.seasonalTravels.totalTravelsSummer,
            this.seasonalTravels.totalTravelsAutumn,
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
    this.basicSeasonOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#5A72A0',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#5A72A0',
            stepSize: 1,
          },
          grid: {
            color: '#1A2130',
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: '#5A72A0',
          },
          grid: {
            color: '#1A2130',
            drawBorder: false,
          },
        },
      },
    };

    this.monthlyPlotTripsData = {
      labels: this.monthlyTripsLabels,
      datasets: [
        {
          label: 'Active trips by',
          data: this.monthlyTripsData,
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
    this.monthlyPlotTripsOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#5A72A0',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#5A72A0',
            stepSize: 1,
          },
          grid: {
            color: '#1A2130',
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: '#5A72A0',
          },
          grid: {
            color: '#1A2130',
            drawBorder: false,
          },
        },
      },
    };
    this.isLoading.next(false);
  }

  generateLabelsAndDataForMonths(
    startDate: Date,
    endDate: Date,
    monthlyTravels: MonthyTripsDto[]
  ) {
    var labels: String[] = [];
    var data: Number[] = [];

    if (startDate !== endDate) {
      for (
        let date = startDate;
        startDate.getFullYear() < endDate.getFullYear() ||
        (startDate.getFullYear() === endDate.getFullYear() &&
          startDate.getMonth() <= endDate.getMonth());
        date.setMonth(date.getMonth() + 1)
      ) {
        const foundTravel = monthlyTravels.find(
          (travel) =>
            date.getFullYear() === travel.year &&
            date.getMonth() + 1 === travel.month
        );
        if (foundTravel) {
          data.push(foundTravel.tripCount);
        } else {
          data.push(0);
        }
        const formattedLabel = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        labels.push(formattedLabel);
      }
    } else {
      const formattedLabel = `${startDate.getFullYear()}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;
      labels.push(formattedLabel);
      data.push(monthlyTravels[0].tripCount);
    }

    return { labels, data };
  }
}
