import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // HTTP_INTERCEPTORS removed
import { AuthService } from './services/auth.service';
// AuthInterceptor import removed as it's now a functional interceptor used in app.config.ts

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService // AuthService is providedIn: 'root', but also listed here as per earlier steps.
    // HTTP_INTERCEPTORS provider removed
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
