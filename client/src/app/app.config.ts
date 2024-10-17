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
  TravelClient,
  UsersClient,
} from './services/api';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { PhotoService } from './services/photo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    PhotoService,
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
      provide: TravelClient,
      useFactory: (http: HttpClient) => new TravelClient(http),
      deps: [HttpClient],
    },
    {
      provide: UsersClient,
      useFactory: (http: HttpClient) => new UsersClient(http),
      deps: [HttpClient],
    },
  ],
};
