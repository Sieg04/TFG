import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http'; // HTTP_INTERCEPTORS removed
// AuthService import removed as it's providedIn: 'root' and no longer needed here
// AuthInterceptor import removed as it's now a functional interceptor used in app.config.ts

@NgModule({
  declarations: [],
  imports: [
    CommonModule
    // HttpClientModule removed
  ],
  providers: [
    // AuthService is providedIn: 'root', so removed from here.
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
