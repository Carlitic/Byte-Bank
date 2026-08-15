import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { BankingService } from './services/banking.service.interface';
import { HttpBankingService } from './services/banking.service.http';
import { LocalBankingService } from './services/banking.service.local';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: BankingService,
      useFactory: () => {
        const isGHPages = window.location.hostname.includes('github.io');
        const params = new URLSearchParams(window.location.search);
        // Force mock locally if ?mock=true is set
        if (isGHPages || params.get('mock') === 'true') {
          return inject(LocalBankingService);
        }
        return inject(HttpBankingService);
      }
    }
  ]
};
