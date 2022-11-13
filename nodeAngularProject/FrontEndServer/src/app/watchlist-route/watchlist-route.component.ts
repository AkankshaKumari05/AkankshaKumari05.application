import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ControllerService } from '../controller.service';
import { CompanyLatestStockPriceModel } from '../app-interface/companyLatestStockPrice';


@Component({
  selector: 'app-watchlist-route',
  templateUrl: './watchlist-route.component.html',
  styleUrls: ['./watchlist-route.component.css']
})
export class WatchlistRouteComponent implements OnInit {
  watchList! : any[];
  isEmpty : boolean = false;
  watchListData! : any[];
  fetchFinish : boolean = false;
  constructor(
    private controller : ControllerService,
    private router: Router
    ){ }

  ngOnInit(): void {
    this.fetchWatchListItem()
    $("#searchBar").removeClass("active");
  }

  checkEmpty() {
    this.watchList = localStorage.getItem('Watchlist')? JSON.parse(localStorage.getItem('Watchlist')!): [];
    if (this.watchList.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }
  public removeFromWatchlist(watchListItem: any) {
    this.watchListData.splice(this.watchListData.indexOf(watchListItem), 1);
    let prevWatchList = JSON.parse(localStorage.getItem('Watchlist')!);
    let newWatchList = prevWatchList.filter(
      (data: any) => data.ticker != watchListItem.ticker.toUpperCase()
    );
    localStorage.setItem('Watchlist', JSON.stringify(newWatchList));
    this.checkEmpty();
  }

  fetchWatchListItem() {
      this.checkEmpty();
      var respArr: any[] = [];
      var res! : any;
      this.watchList.forEach((item) => {
        this.controller.fetchCompanyLatestStockPrice(item.ticker).subscribe((companyLatestStockPrice) => {
          //res = companyLatestStockPrice;
          var info = {
          ticker: item.ticker,
          name: item.name,
          current: companyLatestStockPrice.c,
          change: companyLatestStockPrice.d,
          changePercent: companyLatestStockPrice.dp,
          timestamp: companyLatestStockPrice.t,
        };
        respArr.push(info);
      });
    });
        this.watchListData = respArr;
        this.fetchFinish = true;
        console.log(this.watchListData);
  }

  fetchDetails(ticker: any){
    this.router.navigateByUrl('/search/' + ticker);
  }

}
