import json, requests, time, pytz
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

class Service:

    token='c83f0s2ad3ift3bm8dfg'
    baseURL='https://finnhub.io/api/v1/'

    
    def get(url, params):
        response = requests.get(url, params=params, headers={
            'Content-Type': 'application/json'
        })
        if response.status_code == 200:
            
            return json.loads(response.text) 
        return ""

    @staticmethod   
    def checkEmptyResponse(data):
        for key in data:
            if data[key] == None or data[key]==0 or data[key]==[]:
                return False
        return True 

    @staticmethod
    def getLatestData(data):
        length=len(data)
        latest=0
        if length == 0:
            return []
        elif length == 1:
            return data[latest]
        for i in range(1,length):
            if Service.checkLatestDate(data[latest]['period'],data[i]['period']):
                latest=i
        return data[latest]

    @staticmethod
    def checkLatestDate(latestDate, proposedDate):
        latestDate=Service.stringToDate(latestDate)
        proposedDate=Service.stringToDate(proposedDate)
        if latestDate < proposedDate:
            return True
        else: 
            return False

    @staticmethod
    def getTodayPastDate():
        today=date.today()
        delta = relativedelta(months=6, days=1)
        fromDate=today-delta
        return today,fromDate

    @staticmethod
    def get30DayPastDate():
        today=date.today()
        delta = relativedelta(days=31)
        fromDate=today-delta
        return today,fromDate

    @staticmethod
    def getModifiedDate(dateList):
        modDateList=[]
        for i in range(len(dateList)):
            modDateList.append(Service.epocToDate(dateList[i]))
        return modDateList

    @staticmethod
    def stringToDate(date):
        return datetime.strptime(date, '%Y-%m-%d')

    @staticmethod
    def epocToDate(date):
        temp=datetime.fromtimestamp(date, pytz.timezone('America/Los_Angeles'))
        return datetime.strftime(temp, '%A, %b %d, %Y %H:%M-%S:%f')

    @staticmethod
    def epocToString(date):
        return datetime.fromtimestamp(date).strftime('%d %B, %Y')

    @staticmethod
    def epocToHiphenDate(date):
         return datetime.fromtimestamp(date).strftime('%Y-%m-%d')

    @staticmethod
    def dateToEpoc(date):
        return int(time.mktime(date.timetuple()))
