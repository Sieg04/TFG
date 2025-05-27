import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'; // Added importProvidersFrom
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Added HttpClient providers

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { authInterceptor } from './core/interceptors/auth.interceptor'; // Import the functional interceptor
import { CoreModule } from './core/core.module'; // Import CoreModule

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])), // Provide HttpClient with the interceptor
    importProvidersFrom(CoreModule) // Import providers from CoreModule
  ]
};
