import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { HOST } from './app-interface/hostDetails';
import { CompanyDetailsModel } from './app-interface/companyDetails';
import { AutocompleteDataModel } from './app-interface/autocompleteData';
import { CompanyLatestStockPriceModel } from './app-interface/companyLatestStockPrice';
import { dailyChartPrice } from './app-interface/dailyChartPriceModel';
import { companyNewsDetail } from './app-interface/companyNewsDetailModel';
import { companyHistoricalData } from './app-interface/companyHistoricalData';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(
    private http: HttpClient
    ) { }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error); 
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }    
  fetchAutocompSearch(ticker: string): Observable<AutocompleteDataModel[]> {
    var searchutilUrl=''
    if(ticker!=null){
      searchutilUrl = `${HOST}search/autocomplete/${ticker}`;
    }
    return this.http.get<AutocompleteDataModel[]>(searchutilUrl).pipe(
      catchError(this.handleError('fetchSearchutil', [])) // to continue
    );
    
  }

  fetchCompanyDetails(ticker:string): Observable<CompanyDetailsModel>{
    const companyDetailsUrl = `${HOST}companyDetails/${ticker}`;
    console.log(companyDetailsUrl)
    return this.http.get<CompanyDetailsModel>(companyDetailsUrl);
  }

  fetchCompanyLatestStockPrice(ticker:string): Observable<CompanyLatestStockPriceModel>{
    const companyLatestStockPricesUrl = `${HOST}companyDetails/LatestStockPrice/${ticker}`;
    console.log(companyLatestStockPricesUrl)
    return this.http.get<CompanyLatestStockPriceModel>(companyLatestStockPricesUrl);
  }

  fetchCompanyPeers(ticker:string): Observable<string[]>{
    const companyPeersDetailsUrl = `${HOST}companyPeers/${ticker}`;
    console.log(companyPeersDetailsUrl)
    return this.http.get<string[]>(companyPeersDetailsUrl);
  }

  fetchDailyCharts(ticker:string, timeInterval:number, fromDate:number, toDate:number): Observable<dailyChartPrice>{
    const companyDailyChartUrl = `${HOST}company/hightcharts/${ticker}/${timeInterval}/${fromDate}/${toDate}`;
    console.log(companyDailyChartUrl)
    return this.http.get<dailyChartPrice>(companyDailyChartUrl);
  }

  fetchNews(ticker:string): Observable<companyNewsDetail>{
    const companyNewsDetailsUrl = `${HOST}companyNews/${ticker}`;
    console.log(companyNewsDetailsUrl)
    return this.http.get<companyNewsDetail>(companyNewsDetailsUrl);
  }

  fetchHistCharts(ticker:string, timeInterval:string, fromDate:number, toDate:number): Observable<companyHistoricalData>{
    const companyHistChartUrl = `${HOST}company/hightcharts/${ticker}/${timeInterval}/${fromDate}/${toDate}`;
    console.log(companyHistChartUrl)
    return this.http.get<companyHistoricalData>(companyHistChartUrl);
  }

  fetchCompanySocialSentiments(ticker:string): Observable<any>{
    const companySocialSentimentUrl = `${HOST}companySocialSentiment/${ticker}`;
    console.log(companySocialSentimentUrl)
    return this.http.get<any>(companySocialSentimentUrl);
  }

  fetchCompanyRecommendationTrend(ticker:string): Observable<any>{
    const companyRecommendationTrendUrl = `${HOST}recommendationTrend/${ticker}`;
    console.log(companyRecommendationTrendUrl)
    return this.http.get<any>(companyRecommendationTrendUrl);
  }

  fetchCompanyEarnings(ticker:string): Observable<any>{
    const companyEarningsUrl = `${HOST}companyEarnings/${ticker}`;
    console.log(companyEarningsUrl)
    return this.http.get<any>(companyEarningsUrl);
  }

}
