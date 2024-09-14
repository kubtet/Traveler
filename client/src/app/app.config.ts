import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AccountClient, UsersClient } from './services/api';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    {
      provide: AccountClient,
      useFactory: () => new AccountClient(),
      deps: [HttpClient],
    },
    {
      provide: UsersClient,
      useFactory: () => new UsersClient(),
      deps: [HttpClient],
    },
    MessageService,
  ],
};
