const App = (() => {
  "use strict";

  const messageContainerId = "message-container";
  const chartContainerId = "chart-container";
  const hideClass = "hide";

  let ticker = null;
  let messageContainer = null;
  let chartContainer = null;

  const baseUrl = "https://stock-search-bandroid-server.wl.r.appspot.com/earnings";

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
           const actualData =[];
           const estimateData =[];
           const periodSurpriseData =[];
           const surpriseData =[];
           items.forEach((earning)=>{
             periodSurpriseData.push(earning.period+"<br>Surprise: "+earning.surprise)
             surpriseData.push(earning.surprise)
             actualData.push(earning.actual)
             estimateData.push(earning.estimate)
           });

           const chart = Highcharts.chart(chartContainerId, {

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
                 marker: {
                      enabled: true
                   },
                   label: {
                      onArea: true
                   },
                 data: actualData
             },
             {
                 name: 'Estimate',
                 type: 'spline',
                 color: 'black',
                 marker: {
                    enabled: true
                 },
                 label: {
                    onArea: false
                 },
                 data: estimateData

             }
             ]
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