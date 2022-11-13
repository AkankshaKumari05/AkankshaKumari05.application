import express from "express" ;
import fetch from "node-fetch";
import cors from "cors";
const app = express();
const PORT = parseInt(process.env.PORT) || 8080;
const baseURL ="https://finnhub.io/api/v1/"
const token="c83f0s2ad3ift3bm8dfg"


app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
    });

    next();
});

app.get('/', (req, res) => {
  res.status(200).send('Service is up').end();
});

app.get('/search/autocomplete/:ticker', (req, res) =>{
    const ticker = req.params.ticker;
    const url = baseURL.concat("search?q=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          var responseDataJson = await JSON.parse(responseData);
          if (isEmptyObject(responseDataJson["result"])){
            let resData = responseDataJson["result"].filter( x => (x.type === 'Common Stock' && x.symbol.indexOf('.') == -1));
            res.send({"resp" : responseDataJson});
          }
          else{
            res.send({"resp" : responseDataJson});
          }
          
        } catch (e) {
          console.error(e) 
        }
      } 
    returnData()
})

app.get('/tickerDetails/:ticker', (req, res, next) => {

    const ticker = req.params.ticker;
    async function returnData() {
        try {
          let companyDetail= await getCompanyDetail(ticker)
          let latestStockPrice= await getLatestStockPrice(ticker)
          let companyPeers = await getCompanyPeers(ticker)
          let companyNews = await getCompanyNews(ticker)
          let companySocialSentiment = await getCompanySocialSentiment(ticker)
          let info ={
                "name" : companyDetail['name'],
                "ticker" : companyDetail['ticker'],
                "logo": companyDetail['logo'],
                "changePrice": latestStockPrice['d'],
                "changePercentage": latestStockPrice['dp'],
                "currentPrice": latestStockPrice['c'],
                "highPrice": latestStockPrice['h'],
                "lowPrice": latestStockPrice['l'],
                "openPrice": latestStockPrice['o'],
                "prevClose": latestStockPrice['pc'],
                "ipo": companyDetail['ipo'],
                "industry": companyDetail['finnhubIndustry'],
                "webPage": companyDetail['weburl'],
                "peers": companyPeers,
          }
          let response = {
            "info": info,
            "news" : companyNews,
            "reddit": companySocialSentiment['reddit'],
            "twitter": companySocialSentiment['twitter']
          }
          res.send({"data":response});
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/recommendation/:ticker', (req, res, next) => {

    const ticker = req.params.ticker;
    
    const url = baseURL.concat("stock/recommendation?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          res.send( responseDataJson);
        } catch (e) {
          console.error(e);  
        }
    }
    returnData();
});


app.get('/earnings/:ticker', (req, res, next) => {

    const ticker = req.params.ticker;    
    const url = baseURL.concat("stock/earnings?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData.split(null).join(0));
          res.send( responseDataJson);
        } catch (e) {
          console.error(e); 
        }
    }
    returnData();
});


app.get('/hightcharts/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    const timeInterval = 'D';
    const datetime = new Date();
    const toDate = parseInt(datetime.getTime()/1000);
    const pastDate = new Date(datetime.setFullYear(datetime.getFullYear() - 2)).getTime()
    const fromDate =parseInt(pastDate/1000);
    const url = baseURL.concat("stock/candle?symbol=",ticker,"&resolution=",timeInterval,"&from=",fromDate,"&to=",toDate,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responsesDataJson = await JSON.parse(responseData);
          res.send(responsesDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/hourlycharts/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    const timeInterval = '5';
    const datetime = new Date();
    const toDate = parseInt(datetime.getTime()/1000);
    const fromDate =parseInt(datetime.getTime()/1000)-21600;
    const url = baseURL.concat("stock/candle?symbol=",ticker,"&resolution=",timeInterval,"&from=",fromDate,"&to=",toDate,"&token=",token);
    console.log(url)
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responsesDataJson = await JSON.parse(responseData);
          res.send(responsesDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});


app.get('/latestStockPrice/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    var tickers = ticker.split("_");
    var responsesDataJson ={};

    var len = tickers.length;
    if (len == 2){
        if (tickers[1].length == 0)
            len =1;
    }
    console.log(len)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    var i=0;
    async function returnData() {
        try {
             tickers.forEach(async tick =>{
             let response =  await getLatestStockPrice(tick);
             console.log(tick)
             console.log(response)
             responsesDataJson[tick]= await response['c'];
             console.log("hehe",responsesDataJson)
             i+=1;
             if (i == len){
                let data= {
                    "data":responsesDataJson
                }
                res.send(data);
             }
          }); 
        
        } catch (e) {
          console.error(e);  
        }

      }
    returnData();
});



async function getCompanyDetail(ticker) {
    
    const url = baseURL.concat("stock/profile2?symbol=",ticker,"&token=",token);
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          return responseDataJson;
        } catch (e) {
          console.error(e);  
        }
}

async function getLatestStockPrice(ticker){

    const url = baseURL.concat("quote?symbol=",ticker,"&token=",token);
        try {
            console.log(ticker)
            console.log(url)
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          if (responseDataJson['c']==0 && responseDataJson['h']==0 && responseDataJson['o']==0 && responseDataJson['t']==0  ){
            responseDataJson=[]
          }
          return responseDataJson;
        } catch (e) {
          console.error(e);  
        }
}

async function getCompanyPeers(ticker){

    const url = baseURL.concat("stock/peers?symbol=",ticker,"&token=",token);
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          return responseDataJson;
        } catch (e) {
          console.error(e);  
        }
}

async function getCompanyNews(ticker){

    const datetime = new Date();
    const date= new Date();
    const pastDate = new Date(datetime.setDate(datetime.getDate() - 30))
    const toDate = date.toISOString().slice(0,10);
    const fromDate = pastDate.toISOString().slice(0,10);
    console.log(toDate,fromDate);
    const url = baseURL.concat("company-news?symbol=",ticker,"&from=",fromDate,"&to=",toDate,"&token=",token);
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          let respData=[]
          for (let i = 0; respData.length< 5 && i < responseDataJson.length; i++) {
            if (responseDataJson[i]['category'].length != 0 && responseDataJson[i]['datetime'].length != 0 && responseDataJson[i]['headline'].length != 0 && 
                responseDataJson[i]['id'].length != 0 && responseDataJson[i]['related'].length != 0  && responseDataJson[i]['source'].length != 0 && 
                responseDataJson[i]['summary'].length != 0 && responseDataJson[i]['url'].length != 0 && responseDataJson[i]['image'].length != 0){
                respData.push(responseDataJson[i]);
                } 
            }
          
          return respData;
        } catch (e) {
          console.error(e);  
        }
}

async function getCompanySocialSentiment(ticker){
    
    const url = baseURL.concat("stock/social-sentiment?symbol=",ticker,"&from=2022-01-01&token=",token);

        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          let respData={}
          let ment=0, posMent=0, negMent=0;
          responseDataJson["reddit"].forEach(data =>{
              ment+=data["mention"];
              posMent+=data["positiveMention"];
              negMent+=data["negativeMention"];
          }); 
          let reddit={
            "mention" : ment,
            "positiveMention" : posMent,
            "negativeMention" : negMent
            }
          ment=0, posMent=0, negMent=0;
          responseDataJson["twitter"].forEach(data =>{
              ment+=data["mention"];
              posMent+=data["positiveMention"];
              negMent+=data["negativeMention"];
          }); 
          let twitter={
            "mention" : ment,
            "positiveMention" : posMent,
            "negativeMention" : negMent
            }  
          respData={
            "reddit" : reddit,
            "twitter" : twitter
            }
          //responseDataJson=await JSON.parse(respData);
          //console.log(respData);
          return respData;
        } catch (e) {
          console.error(e);  
        }
}



async function isEmptyObject(obj) {
    if(obj== [] || obj == undefined){
        return false;
    }
    return !Object.keys(obj).length;
}

async function filter(data)
{
    var res = data.filter( x => x.type === 'Common Stock');
    return res
}



// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


