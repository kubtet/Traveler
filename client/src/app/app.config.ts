import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AccountClient, BuggyClient } from './services/api';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
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
  ],
};
