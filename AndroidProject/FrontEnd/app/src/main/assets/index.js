const App = (() => {
  "use strict";

  const messageContainerId = "message-container";
  const chartContainerId = "chart-container";
  const hideClass = "hide";

  let ticker = null;
  let messageContainer = null;
  let chartContainer = null;

  const baseUrl = "https://stock-search-bandroid-server.wl.r.appspot.com/hightcharts";

  const show = (element) => {
    element.classList.remove(hideClass);
  };

  const hide = (element) => {
    element.classList.add(hideClass);
  };

  const setMessage = (message) => {
    messageContainer.innerHTML = message;
  };

  const showLoading = () => {
    hide(chartContainer);
    setMessage("Fetching Data");
    show(messageContainer);
  };

  const showError = (message) => {
    hide(chartContainer);
    setMessage(message);
    show(messageContainer);
  };

  const showChart = () => {
    hide(messageContainer);
    show(chartContainer);
  };

  const buildChart = (items) => {
    const ohlc = [];
    const volume = [];
    let intTimestamp, i;
    for (i = 0; i < items.c.length; i += 1) {
        intTimestamp = (items.t[i]-25200)*1000;
      ohlc.push([intTimestamp, items.o[i], items.h[i], items.l[i], items.c[i]]);
      volume.push([intTimestamp, items.v[i]]);
    }

    const chart = Highcharts.stockChart(chartContainerId, {

      margin: 0,
      tooltip: {
        split: true,
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
            align: "right",
            x: -3,
          },
          title: {
            text: "OHLC",
          },
          height: "60%",
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "Volume",
          },
          top: "65%",
          height: "35%",
          offset: 0,
          lineWidth: 2,
        },
      ],



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
      title: { text: ticker + ' Historical' },
            subtitle: {
              text: 'With SMA and Volume by Price technical indicators',
            },

      series: [
        {
          type: "candlestick",
          name: ticker,
          id: ticker.toLowerCase(),
          zIndex: 2,
          data: ohlc,
          tooltip: {
            valueDecimals: 2,
          },
        },
        {
          type: "column",
          name: "Volume",
          id: "volume",
          data: volume,
          yAxis: 1,
        },
        {
          type: "vbp",
          linkedTo: ticker.toLowerCase(),
          params: {
            volumeSeriesID: "volume",
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: "sma",
          linkedTo: ticker.toLowerCase(),
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],

      exporting: {
          enabled: false,
        }
    });
  };

  const fetchDataAndLoadChart = () => {
    class CheckedError extends Error {
      constructor(message) {
        super(message);
      }
    }

    fetch(`${baseUrl}/${ticker}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          throw new CheckedError("No data available");
        } else {
          throw new CheckedError("Error occurred while fetching data");
        }
      })
      .then((responseJson) => {
        showChart();
        buildChart(responseJson);
      })
      .catch((error) => {
        let message = null;
        if (error instanceof CheckedError) {
          message = error.message;
        } else {
          message = "Network error occurred while fetching data" + error;
        }
        showError(message);
      });
  };

  const initializeTicker = () => {
    const params = new URLSearchParams(window.location.search);
    ticker = params.get("ticker");
  };

  const initializeContainers = () => {
    messageContainer = document.getElementById(messageContainerId);
    chartContainer = document.getElementById(chartContainerId);
  };

  const init = () => {
    initializeTicker();
    initializeContainers();
    fetchDataAndLoadChart();
  };

  return {
    init,
  };
})();