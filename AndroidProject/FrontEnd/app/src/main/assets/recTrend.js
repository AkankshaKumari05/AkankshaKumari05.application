const App = (() => {
  "use strict";

  const messageContainerId = "message-container";
  const chartContainerId = "chart-container";
  const hideClass = "hide";

  let ticker = null;
  let messageContainer = null;
  let chartContainer = null;

  const baseUrl = "https://stock-search-bandroid-server.wl.r.appspot.com/recommendation";

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
        const timeData = [];
        const buyData = [];
        const holdData = [];
        const sellData = [];
        const strongSellData = [];
        const strongBuyData = [];
        items.forEach((trend)  => {
          timeData.push(trend.period)
          buyData.push(trend.buy)
          holdData.push(trend.hold)
          sellData.push(trend.sell)
          strongSellData.push(trend.strongSell)
          strongBuyData.push(trend.strongBuy)
        });
        const chart = Highcharts.chart(chartContainerId, {
          title: {
              text: 'Recommendation Trends'
          },
          xAxis: {
              categories: timeData
          },
          yAxis: {
              min: 0,
            title: {
                text: '#Analysis'
            },
            stackLabels: {
              enabled: true,
              align: 'center'
            }
          },
          credits: {
            enabled: true
          },

          legend: {
                  borderColor: '#C7C7C7',
                  borderWidth: 1,
                  align: 'center'
              },

          tooltip: {
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '&bull; {series.name}: <b>{point.y}</b>'
          },
          plotOptions: {
              column: {
                  stacking: 'normal',

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