import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { TradeTransactionComponent } from '../trade-transaction/trade-transaction.component';
import { ControllerService } from '../controller.service';

@Component({
  selector: 'app-portfolio-route',
  templateUrl: './portfolio-route.component.html',
  styleUrls: ['./portfolio-route.component.css']
})
export class PortfolioRouteComponent implements OnInit {
  portfolioList! : any[];
  isEmpty : boolean = false;
  PortfoliotData! : any[];
  fetchFinish : boolean = false;
  walletMoney! : number; 
  buyAlertSuccess = new Subject<string>();
  soldAlertSuccess = new Subject<string>();
  buySuccessMessage ='';
  soldSuccessMessage = '';
  ticker!:string;

  constructor(
    private controller: ControllerService,
    private tradeModalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.fetchPortfoilioItem();
    this.walletMoney = JSON.parse(localStorage.getItem('walletMoney')!).toFixed(2)
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
    $("#searchBar").removeClass("active");
  }


checkEmpty() {
    this.portfolioList = localStorage.getItem('Portfolio')? JSON.parse(localStorage.getItem('Portfolio')!): [];
    if (this.portfolioList.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }

fetchPortfoilioItem() {
    this.checkEmpty();
    var respArr: any[] = [];
    var res! : any;
    this.portfolioList.forEach((item) => {
      this.controller.fetchCompanyLatestStockPrice(item.ticker).subscribe((companyLatestStockPrice) => {
        //res = companyLatestStockPrice;
        var info = {
        ticker: item.ticker,
        companyName: item.companyName,
        quantity: item.quantity,
        totalCost: item.totalCost,
        avgCost:item.totalCost/item.quantity,
        currentPrice: companyLatestStockPrice.c,
        change: (item.totalCost/item.quantity- companyLatestStockPrice.c).toFixed(2),
        marketValue: companyLatestStockPrice.c * item.quantity,
      };
      respArr.push(info);
    });
  });
      this.PortfoliotData = respArr;
      this.fetchFinish = true;
      console.log(this.PortfoliotData);
  }

  // removeFromPortfolio(tickerItem : any) {
  //   var prevPortfolioList = JSON.parse(localStorage.getItem('Portfolio')!);
  //   var newPortfolioList = prevPortfolioList.filter(
  //     (data: any) => data.ticker != tickerItem.ticker.toUpperCase()
  //   );
  //   localStorage.setItem('Portfolio', JSON.stringify(newPortfolioList));
  //   this.checkEmpty();
  // }
  
  // removeFromTickerInfoArr(tickerItem: any) {
  //   var newPortfolioList = this.PortfoliotData.filter(
  //     (data) => data.ticker != tickerItem.ticker
  //   );
  //   this.PortfoliotData = newPortfolioList;
  // }

  tradeStockTrans(data:any , tranType : string) {
    const tradeModal = this.tradeModalService.open(
      TradeTransactionComponent
    );
    tradeModal.componentInstance.ticker = data.ticker;
    tradeModal.componentInstance.companyName = data.companyName;
    tradeModal.componentInstance.latestprice = data.currentPrice;
    tradeModal.componentInstance.transType = tranType;
    tradeModal.result.then((res) => {
      this.ticker= data.ticker;
      if (res != "close" && tranType=='Buy'){
        this.buyAlertSuccess.next('Message successfully changed.');
      }
      if (res != "close" && tranType=='Sell'){
        this.soldAlertSuccess.next('Message successfully changed.');
      }
      if (res != 'close') {
        console.log(res);
        if (res.quantity === 0) {
          // remove from this.portfolioArr and update
          //this.removeFromPortfolio(res);
          //this.removeFromTickerInfoArr(res);
          this.checkEmpty();
        } else {
          // modify this.portfolioArr & this.tickerInforArr
          this.checkEmpty();  // update this.portfolioArr from localStorage
          this.PortfoliotData.forEach((item, i) => {
            if (item.ticker == res.ticker) {
              this.PortfoliotData[i].quantity = res.quantity;
              this.PortfoliotData[i].totalCost = res.totalCost;
              this.PortfoliotData[i].avgCost = res.totalCost / res.quantity;
              this.PortfoliotData[i].marketValue = res.quantity * this.PortfoliotData[i].currentPrice;
              this.PortfoliotData[i].change = (this.PortfoliotData[i].currentPrice - res.totalCost / res.quantity).toFixed(2);
            }
          });
        }
        this.walletMoney=JSON.parse(localStorage.getItem('walletMoney')!).toFixed(2)
      } 
      // this.fetchPortfoilioItem()
    });
  }



}
