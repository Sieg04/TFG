import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Example: Explicitly prerender the dashboard if desired
  // {
  //   path: 'dashboard',
  //   renderMode: RenderMode.Prerender,
  // },
  {
    path: '**', // For all other routes, including parameterized ones
    renderMode: RenderMode.Server // Corrected to Server to avoid prerendering errors
  }
];
