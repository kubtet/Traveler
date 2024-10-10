import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AccountClient, UsersClient, BuggyClient } from './services/api';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
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
      provide: UsersClient,
      useFactory: (http: HttpClient) => new UsersClient(http),
      deps: [HttpClient],
    },
    MessageService,
  ],
};
