import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchHomeRouteComponent } from './search-home-route/search-home-route.component';
import { WatchlistRouteComponent } from './watchlist-route/watchlist-route.component';
import { PortfolioRouteComponent } from './portfolio-route/portfolio-route.component';

const routes: Routes = [
  {
    path: '' ,
    redirectTo: '/search/home',
    pathMatch: 'full'
  },
  {
    path: 'search/:ticker',
    component: SearchHomeRouteComponent,
  },
  {
    path: 'watchlist',
    component: WatchlistRouteComponent,
    pathMatch: 'full'
  },
  {
    path: 'portfolio',
    component: PortfolioRouteComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
