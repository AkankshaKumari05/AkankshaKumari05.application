import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { Options } from 'highcharts/highstock';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-dailychart',
  templateUrl: './dailychart.component.html',
  styleUrls: ['./dailychart.component.css']
})
export class DailychartComponent implements OnInit {
  @Input() dailyChartData : any;
  Highcharts: typeof Highcharts = Highcharts;
  dailyChartOptions!: Options;
  dailyChartsFinish: boolean = false;
  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges){
    this.dailyChartsFinish = false;
    this.dailyChartOptions={}
    this.createDailyCharts();
    this.dailyChartsFinish = true;
  }
  createDailyCharts() {

    var dailyClose = [],
    dataLength = this.dailyChartData.c.length;
    var i, intTimestamp;

    for (i = 0; i < dataLength; i += 1) {
      intTimestamp = (this.dailyChartData.t[i]-25200)*1000;
      dailyClose.push([intTimestamp, this.dailyChartData.c[i]]);
    }
    //console.log(dailyClose);
    this.dailyChartOptions = {
      series: [
        {
          data: dailyClose,
          color: this.dailyChartData.color,
          //name: this.dailyChartData.ticker,
          type: 'line',
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
      navigator: {
        enabled: false
     },
      scrollbar: {
        enabled: true,
      },
      title: { text: this.dailyChartData.ticker},
      rangeSelector: {
        enabled: false,
      },
     
    }; 
  }

}
