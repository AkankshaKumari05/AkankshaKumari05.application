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
            res.send(resData);
          }
          else{
            res.send(responseDataJson);
          }
          
        } catch (e) {
          console.error(e) 
        }
      } 
    returnData()
})

app.get('/companyDetails/:ticker', (req, res, next) => {

    const ticker = req.params.ticker;
    
    const url = baseURL.concat("stock/profile2?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          res.send(responseDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/companyDetails/LatestStockPrice/:ticker', (req, res, next) =>{
    const ticker = req.params.ticker;
    
    const url = baseURL.concat("quote?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          if (responseDataJson['c']==0 && responseDataJson['h']==0 && responseDataJson['o']==0 && responseDataJson['t']==0  ){
            responseDataJson=[]
          }
          res.send(responseDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/companyPeers/:ticker', (req, res, next) =>{
    const ticker = req.params.ticker;
    
    const url = baseURL.concat("stock/peers?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          res.send(responseDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/company/hightcharts/:ticker/:timeInterval/:fromDate/:toDate', (req, res, next) => {
    const ticker = req.params.ticker;
    const timeInterval = req.params.timeInterval;
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    //console.log(ticker,timeInterval,fromDate,toDate);
    const url = baseURL.concat("stock/candle?symbol=",ticker,"&resolution=",
        timeInterval,"&from=",fromDate,"&to=",toDate,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          res.send(responseDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/companyNews/:ticker', (req, res, next) =>{
    const ticker = req.params.ticker;
    const datetime = new Date();
    const pastDate = new Date(datetime.setDate(datetime.getDate() - 30))
    const toDate = datetime.toISOString().slice(0,10);
    const fromDate = pastDate.toISOString().slice(0,10);
    const url = baseURL.concat("company-news?symbol=",ticker,"&from=",fromDate,"&to=",toDate,"&token=",token);
    async function returnData() {
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
          
          res.send(respData);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/companySocialSentiment/:ticker', (req, res, next) =>{
    const ticker = req.params.ticker;
    
    const url = baseURL.concat("stock/social-sentiment?symbol=",ticker,"&from=2022-01-01&token=",token);
    async function returnData() {
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
          res.send(respData);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/recommendationTrend/:ticker', (req, res, next) =>{
    const ticker = req.params.ticker;
    
    const url = baseURL.concat("stock/recommendation?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData);
          res.send(responseDataJson);
        } catch (e) {
          console.error(e);  
        }
      }
    returnData();
});

app.get('/companyEarnings/:ticker', (req, res, next) =>{
    const ticker = req.params.ticker;
    
    const url = baseURL.concat("stock/earnings?symbol=",ticker,"&token=",token);
    async function returnData() {
        try {
          let response = await fetch(url);
          let responseData = await response.text();
          let responseDataJson = await JSON.parse(responseData.split(null).join(0));
          res.send(responseDataJson);
        } catch (e) {
          console.error(e); 
        }
      }
    returnData();
});



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


