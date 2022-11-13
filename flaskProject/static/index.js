//var serverUrl="http://127.0.0.1:5000/"
var serverUrl="https://stock-search-project-ak.wl.r.appspot.com/"


function onload(){
    $(document).keydown(function(event) {
        if ($("#searchText").is(":focus") && (event.key === 13 || event.key == "Enter")) {
            getStockDetails();
        }
    });
    $("#searchText").val('');
}

function checkSearchTextError(){
    $('#searchTooltip').addClass('hide');
}

function getStockDetails(){
    searchText=$("#searchText").val();
    if (validText(searchText)){
        getCompanyStockDetails(searchText)
    }
    
}

function clearSearchTextBox(){
    $("#searchText").val("")
    $('#responseError').addClass('hide');
    $('#responseSuccess').addClass('hide');
    $('#responseDetail').addClass('hide');
    $('#searchTooltip').addClass('hide');
}

function validText(text){
    if ($.trim(text) == ""){
        $('#searchTooltip').removeClass('hide');
        $('#responseError').addClass('hide');
        return false
    }
    else{
        $('#searchTooltip').addClass('hide');
        return true
    }
}

function getView(id){
    curAct=$(".active").attr("id");
    if(id=='newSearch'){
        if (curAct==undefined || curAct==null){
            curAct='companyRes';
            $('#'+curAct).addClass('active'); 
        } 
        $('#'+curAct+"Detail").removeClass('hide');
    }
    else{
        $('#'+curAct).removeClass('active');
        $('#'+curAct+"Detail").addClass('hide');
        $('#'+id).addClass('active');
        $('#'+id+"Detail").removeClass('hide');
    }
}

function getCompanyStockDetails(searchText){
    url=serverUrl+"companyStockDetails/"+searchText
    fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    }).then((response) => response.json().then((data) => {
        if (response.status == 200) {
            if (data.response == 200){
                $('#responseError').addClass('hide');
                $('#responseSuccess').removeClass('hide');
                $('#responseDetail').removeClass('hide');
                $('#chartsResDetail').addClass('hide');
                $( "#companyResDetail" ).load( "companyRes.html", function() {
                    if(data.companyLogo.length>0){
                        $("#companyLogo").attr("src", data.companyLogo)
                    }
                    else{
                        $("#companyLogo").addClass('hide')
                    }
                    $("#companyName").text(data.companyName)
                    $("#stockTickerSymbol").text(data.stockTickerSymbol)
                    $("#stockExchangeCode").text(data.stockExchangeCode)
                    $("#companyStartDate").text(data.companyStartDate)
                    $("#companyCategory").text(data.category)
                });
                getQuoteSummaryDetails(searchText)
                getCompanyNewsDetails(searchText)
                getHighChartDetails(searchText)
                getView("newSearch")
                }
            else if (data.response == 404){
                $('#responseDetail').addClass('hide');
                $('#responseSuccess').addClass('hide');
                $('#responseError').removeClass('hide');
                $("#responseErrorMsg").text("Error: No record has been found, please enter a valid symbol")
            }
        }
    })).catch(function(error) {
        $('#responseDetail').addClass('hide');
        $('#responseSuccess').addClass('hide');
        $('#responseError').removeClass('hide');
        $("#responseErrorMsg").text("Network Error: Internal Server Error")
    });
}

function getQuoteSummaryDetails(searchText){ 
    $('#stockSumResDetail').addClass('hide');
    url=serverUrl+"quoteSummaryDetails/"+searchText
    fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    }).then((response) => response.json().then((data) => {
        if (response.status == 200) {
            if (data.response == 200){
                $( "#stockSumResDetail" ).load( "stockSumRes.html", function() {
                    $("#stockTickerSymbolSum").text(data.stockTickerSymbol)
                    $("#tradingDay").text(data.tradingDay)
                    $("#previousClosingPrice").text(data.previousClosingPrice)
                    $("#openingPrice").text(data.openingPrice)
                    $("#highPrice").text(data.highPrice)
                    $("#lowPrice").text(data.lowPrice)
                    if (data.change < 0){
                        $("#changeSum").html("<span>"+data.change+"</span>"+
                        "<img class='arrowSize' src='appImage/RedArrowDown.png' alt='image'></img>")
                    }
                    else if(data.change > 0){
                        $("#changeSum").html("<span>"+data.change+"</span>"+
                        "<img class='arrowSize' src='appImage/GreenArrowUp.png' alt='image'></img>")
                    }
                    else{
                        $("#changeSum").html("<span>"+data.change+"</span>")
                    }
                    if (data.changePercent < 0){
                        $("#changePercent").html("<span>"+data.changePercent+"</span>"+
                        "<img class='arrowSize' src='appImage/RedArrowDown.png' alt='image'></img>")
                    }
                    else if(data.changePercent > 0){
                        $("#changePercent").html("<span>"+data.changePercent+"</span>"+
                        "<img class='arrowSize' src='appImage/GreenArrowUp.png' alt='image'></img>")
                    }
                    else{
                        $("#changePercent").html("<span>"+data.changePercent+"</span>")
                    }
                    $("#strongSell").text(data.strongSell)
                    $("#sell").text(data.sell)
                    $("#hold").text(data.hold)
                    $("#buy").text(data.buy)
                    $("#strongBuy").text(data.strongBuy)
                });
                }
                if (data.response == 404){
                    $("#stockSumResDetail").html("<p class='resError'>Opps! No Data Found!</p>")
                }

        }
    })).catch(function(error) {
        $("#stockSumResDetail").html("<p class='resError'>Opps! Internal Server Error</p>")
    });
}

function getHighChartDetails(searchText){
    $('#chartsResDetail').addClass('hide');
    url=serverUrl+"highChartDetails/"+searchText
    fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    }).then((response) => response.json().then((data) => {
        if (response.status == 200){
            if (data.response == 200){
            stockPricesData=[]
            volumesData=[]
            for(i=0; i< data.dateString.length;i++){
                date = new Date(data.dateString[i]);
                epochDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
                stockPricesData.push([epochDate, data.stockPriceData[i]]);
                volumesData.push([epochDate, data.volumeData[i]]);
            }
            Highcharts.stockChart('chartsResDetail', {
                title: {
                    text: `Stock Price ${searchText} ${data.todayDate}`
                },
    
                subtitle: {
                    text: '<div style="margin-top: 10px;"><a href="https://finnhub.io/" target="_blank">Source: Finnhub</a></div>',
                    useHTML: true
                },
                xAxis: {
                    type: 'datetime',
                    minRange: 24 * 60 * 60 * 1000,
                    minTickInterval: 24 * 60 * 60 * 1000,
                    tickPixelInterval: 75,
                    startOnTick: true,
                    endOnTick: true
                },
                
                yAxis: [{
                    title: {
                        text: 'Stock Price'
                    },
                    minTickInterval:10,
                    tickPixelInterval:65,
                    opposite: false,
                    startOnTick: true
                }, {
                    title: {
                        text: 'Volume'
                    },
                    tickPixelInterval:65,
                    minTickInterval:500,
                    opposite: true
                }],
    
                rangeSelector: {
                    allButtonsEnabled: true,
                    buttons: [{
                        type: 'day',
                        text: '7d',
                        count: 7
                    }, {
                        type: 'day',
                        text: '15d',
                        count: 15
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }],
                    selected: 5,
                    inputEnabled: false
                },
    
                chart: {
                    spacingTop: 15,
                    spacingLeft: 15,
                    spacingRight: 15
                },
    
                series: [{
                    name: 'Stock Price',
                    type: 'area',
                    data: stockPricesData,
                    tooltip: {
                        valueDecimals: 2
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    yAxis: 0,
                    pointPlacement: 'on'
                }, {
                    name: 'Volume',
                    type: 'column',
                    data: volumesData,
                    pointWidth: 4,
                    yAxis: 1,
                    pointPlacement: 'on',
                    color: '#324854'
                }]
            });
            }
            if (data.response == 404){
                $("#chartsResDetail").html("<p class='resError'>Opps! No Data Found!</p>")
            }
        }
          
    })).catch(function(error) {
        $("#chartsResDetail").html("<p class='resError'>Opps! Internal Server Error</p>")
    });
}

function getCompanyNewsDetails(searchText){
    $('#latestNewsResDetail').addClass('hide');
    url=serverUrl+"companyNewsDetails/"+searchText
    fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    }).then((response) => response.json().then((data) => {
        if (response.status == 200) {
            if (data.response == 200){
                latestHtml=""
                for (i=0; i< data.news.length ; i+=1  ){
                    latestHtml+="<div class='newsTab'>"
                    latestHtml+="<img src='"+data.news[i].image+"' alt='Image not Found' class='image'>"
                    latestHtml+="<div class='newsTextTab'><p class='title'>"+data.news[i].title+"</p>"
                    latestHtml+="<p class='date'>"+data.news[i].date+"</p>"
                    latestHtml+="<a href='"+data.news[i].link+"' target='_blank' class='link'>See Original Post</a>"
                    latestHtml+="</div></div>"
                   
                }
                $( "#latestNewsResDetail" ).html(latestHtml)
                }
                if (data.response == 404){
                    $("#latestNewsResDetail").html("<p class='resError'>Opps! No Data Found!</p>")
                }
        }
    })).catch(function(error) {
        $("#latestNewsResDetail").html("<p class='resError'>Opps! Internal Server Error</p>")
    });
}

