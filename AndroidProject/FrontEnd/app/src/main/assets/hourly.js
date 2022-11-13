const App = (() => {
  "use strict";

  const messageContainerId = "message-container";
  const chartContainerId = "chart-container";
  const hideClass = "hide";

  let ticker = null;
  let color = null;
  let messageContainer = null;
  let chartContainer = null;

  const baseUrl = "https://stock-search-bandroid-server.wl.r.appspot.com/hourlycharts";


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
    var dailyClose = [],
        dataLength = items.c.length;
        var i, intTimestamp;

        for (i = 0; i < dataLength; i += 1) {
          intTimestamp = (items.t[i]-25200)*1000;
          dailyClose.push([intTimestamp, items.c[i]]);
        }

    const chart = Highcharts.stockChart(chartContainerId, {
      series: [
        {
          data: dailyClose,
          color: color,
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
      title: { text: ticker + " Hourly Price Variation" },
      rangeSelector: {
        enabled: false,
      },
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
    let change = params.get("change") ;
    if (change < 0){
        color = "#AA0602"
    }
    else if (change > 0){
        color = "#025945"
    }
    else{
        color = "#000000"
    }
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