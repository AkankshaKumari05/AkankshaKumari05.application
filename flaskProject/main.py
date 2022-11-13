from operator import le
from flask import Flask, jsonify, redirect, url_for
from service import Service

app = Flask(__name__)

@app.route('/home')
def homepage():
    return redirect(url_for('static', filename='home.html'))

@app.route('/companyStockDetails/<string:stockTicker>', methods=['GET'])
def getCompanyStockDetails(stockTicker):
    url=Service.baseURL+'stock/profile2'
    params={'symbol':stockTicker, 'token':Service.token}
    data=Service.get(url,params)

    if data!="" or Service.checkEmptyResponse(data):
        try:
            return jsonify({
                'companyLogo': data['logo'],
                'companyName': data['name'],
                'stockTickerSymbol': data['ticker'],
                'stockExchangeCode': data['exchange'],
                'companyStartDate': data['ipo'],
                'category': data['finnhubIndustry'],
                'response': 200
            })
        except:
            return jsonify({'response': 404})
    return ""

@app.route('/quoteSummaryDetails/<string:stockTicker>', methods=['GET'])
def getQuoteSummaryDetails(stockTicker):
    url=Service.baseURL+'quote'
    params={'symbol':stockTicker, 'token':Service.token}
    data=Service.get(url,params)
    trendData=getCompanyRecommendationTrends(stockTicker)
    try:
        return jsonify({
            'stockTickerSymbol': stockTicker,
            'tradingDay': Service.epocToString(data['t']),
            'previousClosingPrice': data['pc'],
            'openingPrice': data['o'],
            'highPrice': data['h'],
            'lowPrice': data['l'],
            'change': data['d'],
            'changePercent': data['dp'],
            'strongSell': trendData['strongSell'],
            'sell': trendData['sell'],
            'hold': trendData['hold'],
            'buy': trendData['buy'],
            'strongBuy': trendData['strongBuy'],
            'response': 200
        })
    except:
        return jsonify({'response': 404})

def getCompanyRecommendationTrends(stockTicker):
    url=Service.baseURL+'stock/recommendation'
    params={'symbol':stockTicker, 'token':Service.token}
    data=Service.get(url,params)
    data=Service.getLatestData(data)
    try:
        if len(data)==0:
            return {'strongSell':0,'sell': 0, 'hold':0, 'buy':0, 'strongBuy':0 }
        return data
    except:
        return jsonify({'response': 404})

@app.route('/highChartDetails/<string:stockTicker>', methods=['GET'])
def getHighChartDetails(stockTicker):
    url=Service.baseURL+'stock/candle'
    today,fromDate = Service.getTodayPastDate()
    todayEpoc=Service.dateToEpoc(today)
    fromDateEpoc=Service.dateToEpoc(fromDate)
    params={'symbol':stockTicker, 'resolution':'D', 'from':fromDateEpoc, 'to':todayEpoc, 'token':Service.token}
    data=Service.get(url,params)
    '''volumnData=[]
    stockPriceData=[]
    for i in range(len(data['t'])):
        volumnData.append([data['t'][i],data['v'][i]])
        stockPriceData.append([data['t'][i],data['c'][i]])'''
    dataDate=Service.getModifiedDate(data['t'])
    try:
        return jsonify({
            'dateString':dataDate,
            'volumeData' : data['v'],
            'stockPriceData': data['c'],
            'todayDate': Service.epocToHiphenDate(todayEpoc),
            'response': 200
        })
    except:
        return jsonify({'response': 404})
   
@app.route('/companyNewsDetails/<string:stockTicker>', methods=['GET'])
def getCompanyNewsDetails(stockTicker):
    url=Service.baseURL+'company-news'
    today,fromDate = Service.get30DayPastDate()
    params={'symbol':stockTicker, 'from':fromDate, 'to':today, 'token':Service.token}
    data=Service.get(url,params)
    try:
        newsData=[]
        for i in range(len(data)):
            if len(newsData)==5 :
                break
            elif len(data[i]['image'])>0 and len(data[i]['headline'])>0 and len(str(data[i]['datetime']))>0 and len(data[i]['url'])>0 :
                temp={}
                temp['image']= data[i]['image']
                temp['title']= data[i]['headline']
                temp['date']= Service.epocToString(data[i]['datetime'])
                temp['link']= data[i]['url']
                newsData.append(temp)  
        return jsonify({'news':newsData, 'response':200})
    except:
        return jsonify({'response': 404})
   
if __name__ == "__main__":
    app.run()