import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  @Input() comapanySentiments:any;
  @Input() companyRecommendationTrend: any;
  @Input() companyEarnings: any;
  recTrendChartOptions!:Options;
  recTrendChartFinish: boolean = false;
  epsChartOptions!: Options;
  epsChartFinish: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    this.recTrendChartFinish = false;
    this.createRecTrendChart();
    this.recTrendChartFinish = true;
    this.epsChartFinish = false;
    this.creactEpsChart();
    this.epsChartFinish = true;
  }

  createRecTrendChart(){
    var timeData: any[] = [];
    var buyData: any[] = [];
    var holdData: any[] = [];
    var sellData: any[] = [];
    var strongSellData: any[] = [];
    var strongBuyData: any[] = [];
    this.companyRecommendationTrend.forEach((trend: any)  => {
      //console.log(trend)
      timeData.push(trend.period.slice(0,7))
      buyData.push(trend.buy)
      holdData.push(trend.hold)
      sellData.push(trend.sell)
      strongSellData.push(trend.strongSell)
      strongBuyData.push(trend.strongBuy)
    });
    this.recTrendChartOptions = {
      title: {
          text: 'Recommendation Trends'
      },
      xAxis: {
          categories: timeData
      },
      yAxis: {
          min: 0,
          title: {
            text: '#Analysis',
            align: 'high'
        }
          /* stackLabels: {
              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color:  'gray'
              }
          } */
      },
      credits: {
        enabled: true
      },

      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '&bull; {series.name}: <b>{point.y}</b>'
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              }
          },
          series : {
            stacking :'normal'
          }
      },
      series: [{
          name: 'Strong Buy',
          type: 'column',
          data: strongBuyData,
          color: '#1F5133'
      }, {
          name: 'Buy',
          type: 'column',
          data: buyData,
          color: '#1CAD50'
      }, {
          name: 'Hold',
          type: 'column',
          data: holdData,
          color: '#A37A1B'
      }, {
        name: 'Sell',
        type: 'column',
        data: sellData,
        color: '#C54A4B'
      }, {
        name: 'Strong Sell',
        type: 'column',
        data: strongSellData,
        color: '#642628'
      }]
    }
  
  }

  creactEpsChart(){
    var actualData :any[]=[];
    var estimateData :any[]=[];
    var periodSurpriseData  :any[]=[];
    var surpriseData  :any[]=[];
    this.companyEarnings.forEach((earning: any)=>{
      periodSurpriseData.push(earning.period+"<br>Surprise: "+earning.surprise)
      surpriseData.push(earning.surprise)
      actualData.push(earning.actual)
      estimateData.push(earning.estimate)
    });

    this.epsChartOptions = {
     
      title: {
          text: 'Historical EPS Surprises'
      },
      xAxis: [{
          reversed: false,
         
          labels: {
              format: '{value}',
          },
          categories: periodSurpriseData,
          showLastLabel: true
      }],
      yAxis: {
          title: {
              text: 'Quarterly EPS'
          },
          labels: {
              format: '{value}'
          },
          lineWidth: 2
      },
      legend: {
          enabled: true
      },
      tooltip : {
        shared: true,
      },
      plotOptions: {
          spline: {
              marker: {
                  enabled: true
              }
          }
      }, 
      series: [{
          name: 'Actual',
          type: 'spline',
          color: '#7CB5EB',
          data: actualData
      },
      {
          name: 'Estimate',
          type: 'spline',
          color: 'black',
          data: estimateData
      }
      ]
  };
  }



}
