import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trade-transaction',
  templateUrl: './trade-transaction.component.html',
  styleUrls: ['./trade-transaction.component.css']
})
export class TradeTransactionComponent implements OnInit {
  @Input() public ticker!: string;
  @Input() public companyName!: string;
  @Input() public latestprice!: number; 
  @Input() public transType!:string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  inputQnty: number = 0;
  purchasedQnty: number = 0;
  stockItem! : any;
  type!:string;
  walletMoney! : number;
  constructor(public tradeModalService: NgbActiveModal) { }

  ngOnInit(): void {
    this.walletMoney = JSON.parse(localStorage.getItem('walletMoney')!)
    this.getStockStorage();

  }


  getStockStorage() {
    var portfolioList = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')!) : [];
    if (this.transType == 'Sell') {
      this.stockItem = portfolioList.filter(
        (data : any) => data.ticker == this.ticker
      )[0];
      this.purchasedQnty = this.stockItem.quantity;
    } else if (this.transType === 'Buy') {
      this.stockItem = portfolioList.filter((data : any) => data.ticker == this.ticker).length
        ? portfolioList.filter((data :any) => data.ticker == this.ticker)[0]
        : { ticker: this.ticker, companyName: this.companyName, quantity: 0, totalCost: 0 };
    }
  }

  trancaction(){

    if (this.transType === 'Sell') {
      var avgcost = this.stockItem.totalCost / this.stockItem.quantity;
      this.stockItem.quantity -= this.inputQnty;
      this.stockItem.totalCost -= avgcost * this.inputQnty;
      this.walletMoney +=avgcost * this.inputQnty;
    } else if (this.transType === 'Buy') {
      this.stockItem.quantity += this.inputQnty;
      this.stockItem.totalCost += this.latestprice * this.inputQnty;
      this.walletMoney -=this.latestprice * this.inputQnty;
    }
    var portfolioList = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')!) : [];
    if (!this.stockItem.quantity) {
      let portfolioArrNew = portfolioList.filter(
        (data : any) => data.ticker != this.ticker
      );
      localStorage.setItem('Portfolio', JSON.stringify(portfolioArrNew));
      localStorage.setItem('walletMoney', JSON.stringify(this.walletMoney));
    } else {
      if (portfolioList.filter((data : any) => data.ticker == this.ticker).length) {
        portfolioList.forEach((item : any, i: number) => {
          if (item.ticker == this.stockItem.ticker) {
            portfolioList[i] = this.stockItem;
          }
        });
      } else {
        portfolioList.push(this.stockItem);
      }
      localStorage.setItem('Portfolio', JSON.stringify(portfolioList));
      localStorage.setItem('walletMoney', JSON.stringify(this.walletMoney));
    }
    this.tradeModalService.close(this.stockItem);
  
  }

}
