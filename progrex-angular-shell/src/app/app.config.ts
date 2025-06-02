import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; // Import withFetch
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // Import chart providers

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { CoreModule } from './core/core.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()), // Add withFetch() here
    importProvidersFrom(CoreModule),
    provideCharts(withDefaultRegisterables()) // Add chart providers here
  ]
};
