import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighchartsChartModule } from 'highcharts-angular';

import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';


import { SearchHomeRouteComponent } from './search-home-route/search-home-route.component';
import { WatchlistRouteComponent } from './watchlist-route/watchlist-route.component';
import { PortfolioRouteComponent } from './portfolio-route/portfolio-route.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NewsModalComponent } from './news-modal/news-modal.component';
import { TradeTransactionComponent } from './trade-transaction/trade-transaction.component';
import { DailychartComponent } from './dailychart/dailychart.component';
import { HistchartComponent } from './histchart/histchart.component';
import { NewsComponent } from './news/news.component';
import { InsightsComponent } from './insights/insights.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchHomeRouteComponent,
    WatchlistRouteComponent,
    PortfolioRouteComponent,
    NavbarComponent,
    FooterComponent,
    NewsModalComponent,
    TradeTransactionComponent,
    DailychartComponent,
    HistchartComponent,
    NewsComponent,
    InsightsComponent

  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    BrowserAnimationsModule,
    HighchartsChartModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
