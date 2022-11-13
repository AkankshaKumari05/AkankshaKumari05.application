import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp

@Component({
  selector: 'app-histchart',
  templateUrl: './histchart.component.html',
  styleUrls: ['./histchart.component.css']
})
export class HistchartComponent implements OnInit {
  @Input() histChartData : any;
  histChartOptions!: Options;
  histChartsFinish!: boolean;
  Highcharts: typeof Highcharts = Highcharts;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    this.histChartsFinish = false;
    this.histChartOptions={};
    this.createHistCharts();
    this.histChartsFinish = true;
  }
  createHistCharts() {
    let i, intTimestamp;

    // split the data set into ohlc and volume
    let ohlc = [],
      volume = [],
      dataLength = this.histChartData.c.length,
      // set the allowed units for data grouping
      groupingUnits = [
        [
          'week', // unit name
          [1], // allowed multiples
        ],
        ['month', [1, 2, 3, 4, 6]],
      ];

    for (i = 0; i < dataLength; i += 1) {
      intTimestamp = (this.histChartData.t[i]-25200)*1000;
      ohlc.push([
        intTimestamp, // the date
        this.histChartData.o[i], // open
        this.histChartData.h[i], // high
        this.histChartData.l[i],
        this.histChartData.c[i]
      ]);


    //console.log(ohlc);
      volume.push([
        intTimestamp, // the date
        this.histChartData.v[i], // the volume
      ]);
    }
    //console.log(volume);

    this.histChartOptions = {
      series: [
        {
          type: 'candlestick',
          name: this.histChartData.ticker,
          id: 'ticker',
          zIndex: 2,
          data: ohlc,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: 'ticker',
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: 'ticker',
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: this.histChartData.ticker + ' Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      xAxis: {
        type: 'datetime',
        startOnTick: true,
        endOnTick: true
    },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      
      rangeSelector: {
        allButtonsEnabled: true,
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        selected: 2,
      },
     
    }; // required
  }

}
