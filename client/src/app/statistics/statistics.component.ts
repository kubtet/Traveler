import { Component, OnInit, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  CountriesByContinentDto,
  MonthyTripsDto,
  SeasonalTravelsDto,
  StatisticsClient,
  TravelTimelineDto,
  UserStatisticsDto,
} from '../services/api';
import { first, firstValueFrom } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';

interface EventItem {
  label?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

const COUNTRIES_IN_CONTINENTS: { [key: string]: number } = {
  Africa: 54,
  Asia: 49,
  Europe: 44,
  NorthAmerica: 23,
  SouthAmerica: 12,
  Oceania: 14,
  Antarctica: 1,
};

const totalCountries = Object.values(COUNTRIES_IN_CONTINENTS).reduce(
  (sum, count) => sum + count,
  0
);

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
  protected totalCountries = totalCountries;
  // seasonal plot
  basicSeasonData: any;
  basicSeasonOptions: any;

  public seenCountriesShare = 0; // percentage of visited countries
  public continentsProgress: {
    name: string;
    visited: number;
    total: number;
    progress: number;
  }[];

  public async ngOnInit() {
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
      (this.statistics.totalCountries / totalCountries) * 100
    );

    this.continentsProgress = Object.entries(COUNTRIES_IN_CONTINENTS).map(
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
  }
}
