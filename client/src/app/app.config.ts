import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  AccountClient,
  BuggyClient,
  CountryClient,
  TravelClient,
  LikesClient,
  UsersClient,
  FollowsClient,
  MessagesClient,
  StatisticsClient,
  NotificationClient,
} from '../api';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { PhotoService } from './services/photo.service';
import { CountryService } from './services/country.service';
import { CityService } from './services/city.service';
import { PresenceService } from './services/presence.service';
import { NavbarNotificationService } from './services/navbar-notification.service';

export const appConfig: ApplicationConfig = {
  providers: [
    CityService,
    CountryService,
    MessageService,
    NavbarNotificationService,
    PhotoService,
    PresenceService,
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor])),
    provideAnimations(),
    {
      provide: AccountClient,
      useFactory: (http: HttpClient) => new AccountClient(http),
      deps: [HttpClient],
    },
    {
      provide: BuggyClient,
      useFactory: (http: HttpClient) => new BuggyClient(http),
      deps: [HttpClient],
    },
    {
      provide: CountryClient,
      useFactory: (http: HttpClient) => new CountryClient(http),
      deps: [HttpClient],
    },
    {
      provide: TravelClient,
      useFactory: (http: HttpClient) => new TravelClient(http),
      deps: [HttpClient],
    },
    {
      provide: LikesClient,
      useFactory: (http: HttpClient) => new LikesClient(http),
      deps: [HttpClient],
    },
    {
      provide: MessagesClient,
      useFactory: (http: HttpClient) => new MessagesClient(http),
      deps: [HttpClient],
    },
    {
      provide: NotificationClient,
      useFactory: (http: HttpClient) => new NotificationClient(http),
      deps: [HttpClient],
    },
    {
      provide: FollowsClient,
      useFactory: (http: HttpClient) => new FollowsClient(http),
      deps: [HttpClient],
    },
    {
      provide: UsersClient,
      useFactory: (http: HttpClient) => new UsersClient(http),
      deps: [HttpClient],
    },
    {
      provide: StatisticsClient,
      useFactory: (http: HttpClient) => new StatisticsClient(http),
      deps: [HttpClient],
    },
  ],
};
