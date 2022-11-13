import { Component, OnInit } from '@angular/core';
import { AutocompleteDataModel } from '../app-interface/autocompleteData';
import { FormBuilder,FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, timer } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ControllerService } from '../controller.service';

import { CompanyLatestStockPriceModel } from '../app-interface/companyLatestStockPrice';
import { CompanyDetailsModel } from '../app-interface/companyDetails';
import { TradeTransactionComponent } from '../trade-transaction/trade-transaction.component'


@Component({
  selector: 'app-search-home-route',
  templateUrl: './search-home-route.component.html',
  styleUrls: ['./search-home-route.component.css']
})
export class SearchHomeRouteComponent implements OnInit {
  tickerValue: any;
  autocompleteData!: AutocompleteDataModel[];
  stockSearchForm: FormGroup;

  isLoading : boolean = false;
  isAutoCompelete : boolean = false;
  isDetailLoad : boolean = false;

  //detail
  ticker!: string;
  dailyChartsColor! : string;
  difference! : number;
  diffPercent! : number;
  lastTimestamp! : number;
  currentLocalTime! : number;
  enableSoldButton! : boolean;
  tickerExists : boolean = false;
  isWatchlisted : boolean = false;
  openStatus! : boolean;
  emptyTicker! : boolean;
  watchListSuccessAlert = new Subject<string>();
  buyAlertSuccess = new Subject<string>();
  soldAlertSuccess = new Subject<string>();
  watchListSuccessMessage = '';
  buySuccessMessage ='';
  soldSuccessMessage = '';
  fetchSubscribe! : Subscription ;

  companyLatestStockPrice!: CompanyLatestStockPriceModel ;
  companyDetails!: CompanyDetailsModel;
  dailyChartPrice! : any;
  conpamyPeerDetails! : string[];
  companyNews! : any;
  histcharts!: any;
  comapanySentiments:any;
  companyRecommendationTrend:any;
  companyEarnings:any;

  constructor(
    private controller:ControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tradeModalService: NgbModal
  ) {
    this.stockSearchForm = this.formBuilder.group({ tickerValue: "" });
  }

  ngOnInit(): void {
      this.stockSearchForm.get('tickerValue')!.valueChanges.pipe(debounceTime(300),tap(() => (this.isLoading = true)),
        switchMap((value) => this.controller.fetchAutocompSearch(value).pipe(finalize(() => (this.isLoading = false)))))
        .subscribe((autoData) => (this.autocompleteData = autoData));
      if (localStorage.getItem('walletMoney') == null){
        localStorage.setItem('walletMoney','25000.00');
      }
      this.route.paramMap.subscribe((params) => {
        this.ticker = params.get('ticker')!;
        this.emptyTicker = false;
        if (this.ticker != "home" && this.ticker != undefined){
         $("#searchBar").addClass("active");
          this.getDetailInitStarted();
          this.isDetailLoad=true;
        }
        else{
          this.removeLocalStorageData();
          $("#searchBar").removeClass("active");
        }
      }); 
  }
  

  onSubmit(tickerData : any) {
    if (tickerData.tickerValue){
      if (tickerData.tickerValue.displaySymbol) {
        this.ticker = tickerData.tickerValue.displaySymbol;
      } else{
        this.ticker = tickerData.tickerValue;
      }
    }
    else{
      this.ticker = tickerData.displaySymbol;
    }
    if(this.ticker!=undefined){
      //this.clearData();
      this.router.navigateByUrl('/search/' + this.ticker);
    }
    else{
      this.emptyTicker=true;
      this.isDetailLoad=true;
    }
    
  }

  displayFn(autoData: AutocompleteDataModel) {
    if (autoData) {
      return autoData.displaySymbol;
    }
    else{
      return autoData;
    }
    
  }

  clearData(){
  this.dailyChartPrice=false
  this.companyNews=false
  this.histcharts=false
  this.comapanySentiments=false
  this.companyRecommendationTrend=false
  this.companyEarnings=false
  }

  resetForm(){
    this.stockSearchForm.reset();
    this.isDetailLoad=false;
    this.removeLocalStorageData();
    this.router.navigateByUrl('/search/home');
  }

 // Detail

  getDetailInitStarted(){

    this.checkWatchlist();
    if(JSON.parse(localStorage.getItem('localCall')!)=="1"){
      localStorage.removeItem('localCall');
      this.getdatafromlocalStorage();
    }
    else{
      localStorage.removeItem('localCall');
      this.fetchAPIData();
    }
    //watchlist
    this.watchListSuccessAlert.subscribe(
      (message) => (this.watchListSuccessMessage = message)
    );
    this.watchListSuccessAlert.pipe(debounceTime(5000)).subscribe(() => (
      this.watchListSuccessMessage = ''
    ));

    //buying
    this.buyAlertSuccess.subscribe(
      (message) => (this.buySuccessMessage = message)
    );
    this.buyAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (
      this.buySuccessMessage = ''
    ));

    //selling
     this.soldAlertSuccess.subscribe(
      (message) => (this.soldSuccessMessage = message)
    );
    this.soldAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (
      this.soldSuccessMessage = ''
    ));

    //check for bought stock
    var portfolioList = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')!) : [];
    var stockItem = portfolioList.filter(
        (data : any) => data.ticker == this.ticker
    )[0];
    if (stockItem!=undefined){
      this.enableSoldButton = stockItem.quantity > 0 ? true : false;
    }
    else{
      this.enableSoldButton = false;
    }

  }

  getdatafromlocalStorage(){
    this.tickerExists = true;
    this.companyDetails= JSON.parse(localStorage.getItem('companyDetails')!);
    this.conpamyPeerDetails= JSON.parse(localStorage.getItem('conpamyPeerDetails')!);
    this.dailyChartPrice= JSON.parse(localStorage.getItem('dailyChartPrice')!);
    this.companyLatestStockPrice= JSON.parse(localStorage.getItem('companyLatestStockPrice')!);
    this.companyNews= JSON.parse(localStorage.getItem('companyNews')!);
    this.histcharts= JSON.parse(localStorage.getItem('histcharts')!);
    this.comapanySentiments= JSON.parse(localStorage.getItem('comapanySentiments')!);
    this.companyRecommendationTrend= JSON.parse(localStorage.getItem('companyRecommendationTrend')!);
    this.companyEarnings= JSON.parse(localStorage.getItem('companyEarnings')!);
    this.difference = this.companyLatestStockPrice.d;
    this.diffPercent =this.companyLatestStockPrice.dp;
    this.lastTimestamp = this.companyLatestStockPrice.t* 1000;
    this.getCurrTime();
    var timeDifference = this.currentLocalTime - this.lastTimestamp;
    if (timeDifference < 60 * 1000) {
      this.openStatus = true;
      this.getLatestPriceNDailyCharts();
    } else {
      this.openStatus = false;
    }
  }

  fetchAPIData(){
    //summary
    this.getCompanyDetails();
    this.getCompanyPeers();
    //news 
    this.getCompanyNews();
    //charts
    this.getHistCharts();
    //insights
    this.getSocialSentiments();
    this.getCompanyRecommendationTrend();
    this.getCompanyEarnings();
  }

  removeLocalStorageData(){
    localStorage.removeItem('companyDetails');
    localStorage.removeItem('conpamyPeerDetails');
    localStorage.removeItem('companyNews');
    localStorage.removeItem('dailyChartPrice');
    localStorage.removeItem('companyLatestStockPrice');
    localStorage.removeItem('comapanySentiments');
    localStorage.removeItem('histcharts');
    localStorage.removeItem('companyRecommendationTrend');
    localStorage.removeItem('companyEarnings');
  }

  getCompanyDetails(){
    this.controller.fetchCompanyDetails(this.ticker).subscribe((companyDetails) => {
      this.companyDetails = companyDetails;
      localStorage.setItem('companyDetails', JSON.stringify(companyDetails));
      if (this.companyDetails.ticker){
        this.tickerExists = true;
        this.getLatestPriceNDailyCharts(); 
      } else {
        this.tickerExists = false;
      }

    });
  }

  getCompanyPeers(){
    this.controller.fetchCompanyPeers(this.ticker).subscribe((conpamyPeerDetails) => {
      this.conpamyPeerDetails = conpamyPeerDetails;
      localStorage.setItem('conpamyPeerDetails', JSON.stringify(conpamyPeerDetails));
    });
  }

  getCompanyNews(){
    this.controller.fetchNews(this.ticker).subscribe((companyNews) => {
      this.companyNews = companyNews;
      localStorage.setItem('companyNews', JSON.stringify(companyNews));
    });
  }

  getLatestPriceNDailyCharts() {
    // update data every 15 seconds
    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      this.controller.fetchCompanyLatestStockPrice(this.ticker).subscribe((latestprice) => {
          this.companyLatestStockPrice = latestprice;
          localStorage.setItem('companyLatestStockPrice', JSON.stringify(latestprice));
          if (this.companyLatestStockPrice.c) {
            this.difference = this.companyLatestStockPrice.d;
            this.diffPercent =this.companyLatestStockPrice.dp;
            if (this.diffPercent > 0) {
              this.dailyChartsColor = '#008000';
            } else if (this.difference < 0) {
              this.dailyChartsColor = '#FF0000';
            } else {
              this.dailyChartsColor = '#000000';
            }
            
            this.lastTimestamp = this.companyLatestStockPrice.t* 1000;
            this.getCurrTime();
            var timeDifference = this.currentLocalTime - this.lastTimestamp;
            // console.log('Time difference:' + timeDifference / 1000 + 's');

            if (timeDifference < 60 * 1000) {
              this.openStatus = true;
            } else {
              this.openStatus = false;
              this.fetchSubscribe.closed=true;
            }

            var fromDate = this.companyLatestStockPrice.t - 21600;
            this.controller.fetchDailyCharts(this.ticker, 5, fromDate, this.companyLatestStockPrice.t).subscribe((dailyChartPrice) => {
                this.dailyChartPrice = dailyChartPrice;
                this.dailyChartPrice.ticker = this.ticker;
                this.dailyChartPrice.color = this.dailyChartsColor;
                localStorage.setItem('dailyChartPrice', JSON.stringify(this.dailyChartPrice));
              }); 
          } else {
            this.tickerExists = false;
            this.dailyChartPrice = { detail: 'Not found.' };
          }

          //console.log('LatestPrice fetched ' + Date());
        });
        if (this.openStatus==false){
          this.fetchSubscribe.closed=true;
        }
    });
    

  }

  getHistCharts() {
    var crtTime = new Date();
    var currTime = new Date(crtTime.toISOString().slice(0, 10)).getTime()/1000;
    let year = crtTime.getFullYear();
    let month = crtTime.getMonth();
    let day = crtTime.getDate();
    let twoYearBack = new Date(year - 2, month, day);
    let histStartDate = new Date(twoYearBack.toISOString().slice(0, 10)).getTime()/1000;; 
    this.controller.fetchHistCharts(this.ticker,'D', histStartDate ,currTime).subscribe((histcharts) => {
        this.histcharts = histcharts;
        this.histcharts.ticker = this.ticker;
        localStorage.setItem('histcharts', JSON.stringify(this.histcharts));
      });
  }

  getSocialSentiments(){
    this.controller.fetchCompanySocialSentiments(this.ticker).subscribe((comapanySentiments) => {
      this.comapanySentiments = comapanySentiments;
      this.comapanySentiments.companyName = this.companyDetails.name;
      localStorage.setItem('comapanySentiments', JSON.stringify(this.comapanySentiments));
    });
  }

  getCompanyRecommendationTrend(){
    this.controller.fetchCompanyRecommendationTrend(this.ticker).subscribe((companyRecommendationTrend) => {
      this.companyRecommendationTrend = companyRecommendationTrend;
      localStorage.setItem('companyRecommendationTrend', JSON.stringify(this.companyRecommendationTrend));
    });
  }

  getCompanyEarnings(){
    this.controller.fetchCompanyEarnings(this.ticker).subscribe((companyEarnings) => {
      this.companyEarnings = companyEarnings;
      localStorage.setItem('companyEarnings', JSON.stringify(this.companyEarnings));
    });
  }



  
  checkWatchlist() {
    var watchlistArr = localStorage.getItem('Watchlist') ? JSON.parse(localStorage.getItem('Watchlist')!) : [];
    let result = watchlistArr.filter(
      (data : any) => data.ticker === this.ticker
    );
    if (result.length) {
      this.isWatchlisted = true;
    } else {
      this.isWatchlisted = false;
    }
  }

  onWatchList(){
    this.isWatchlisted = !this.isWatchlisted;
    var newWatchList;
    var watchList=localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist')!) : [];
    if (this.isWatchlisted) {//add
      var newWatchlistItem = {
        ticker: this.ticker,
        name: this.companyDetails.name,
      };
      watchList.push(newWatchlistItem);
      localStorage.setItem('Watchlist', JSON.stringify(watchList));
    } else {//remove
      newWatchList = watchList.filter(
        (item: { ticker: string; }) => item.ticker != this.ticker
      );
      localStorage.setItem('Watchlist', JSON.stringify(newWatchList));
    }
    this.watchListSuccessAlert.next('Message successfully changed.');
  }

  tradeStockTrans(ticker: string, companyName: string, latestprice: number, transType: string){

    const tradeModal = this.tradeModalService.open(
      TradeTransactionComponent 
    );
    tradeModal.componentInstance.ticker = ticker;
    tradeModal.componentInstance.companyName = companyName;
    tradeModal.componentInstance.latestprice = latestprice;
    tradeModal.componentInstance.transType = transType;
    tradeModal.result.then((res) => {
      console.log(res);
      if (res != "close" && transType=='Buy'){
        this.buyAlertSuccess.next('Message successfully changed.');
      }
      if (res != "close" && transType=='Sell'){
        this.soldAlertSuccess.next('Message successfully changed.');
      }
      if (res !="close"){
        this.enableSoldButton = res.quantity > 0 ? true : false;
      }
    });
  }

  getCurrTime(){
    this.currentLocalTime = Date.now();
  }

  converToPST(date:any){
    let myDate = new Date(date)
    let pstDate = myDate.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles"
    });
    return pstDate;
  }


}

