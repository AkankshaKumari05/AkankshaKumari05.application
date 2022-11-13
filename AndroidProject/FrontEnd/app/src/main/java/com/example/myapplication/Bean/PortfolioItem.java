package com.example.myapplication.Bean;


import android.annotation.SuppressLint;

import com.example.myapplication.R;
import com.example.myapplication.common.StringFormatter;

public class PortfolioItem {

    private String ticker;

    private double price;

    private int stocks;

    private transient Double lastPrice;

    private PortfolioItem() {

    }

    public static PortfolioItem with(String ticker, int stocks, double price) {
        PortfolioItem item = new PortfolioItem();
        item.setTicker(ticker);
        item.setStocks(stocks);
        item.setPrice(price);
        return item;
    }

    private void setTicker(String ticker) {
        this.ticker = ticker;
    }

    private void setStocks(int stocks) {
        this.stocks = stocks;
    }

    private void setPrice(double price) {
        this.price = price;
    }

    public void setLastPrice(double lastPrice) {
        this.lastPrice = lastPrice;
    }

    public boolean hasLastPrice() {
        return this.lastPrice != null;
    }

    public String getTicker() {
        return ticker;
    }

    @SuppressLint("DefaultLocale")
    public String getShareCount() {
        String sharesString = stocks < 2 ? "share" : "shares";
        return String.format("%s %s", StringFormatter.getQuantity(stocks, 0), sharesString);
    }

    public int getStocks() {
        return stocks;
    }

    public Double getLastPrice() {
        return lastPrice;
    }

    public Double getChange() {
        if (!hasLastPrice()) {
            return null;
        }
        return lastPrice - price;
    }

    public Double getAbsoluteChange() {
        if (!hasLastPrice()) {
            return null;
        }
        return Math.abs(lastPrice - price);
    }

    public Double getChangePercentage(){
        if (!hasLastPrice()) {
            return null;
        }
        return Math.abs(lastPrice - price)/lastPrice;
    }

    public Boolean hasPriceChanged() {
        if (!hasLastPrice()) {
            return false;
        }
        return Math.abs(lastPrice - price) >= 0.01;
    }

    public Integer getTrendingDrawable() {
        if (!hasPriceChanged()) {
            return null;
        }
        return getChange() < 0 ? R.drawable.ic_baseline_trending_down_24 : R.drawable.ic_trending_up_24;
    }

    public int getChangeColor() {
        if (!hasPriceChanged()) {
            return R.color.grey_500;
        }
        return getChange() < 0 ? R.color.red : R.color.green;
    }

    public Double getWorth() {
        if (!hasLastPrice()) {
            return null;
        }
        return stocks * lastPrice;
    }

    public void buy(int stocks, double price) {
        int totalStocks = this.stocks + stocks;
        double totalPrice = ((this.stocks * this.price) + (stocks * price)) / totalStocks;
        this.stocks = totalStocks;
        this.price = totalPrice;
    }

    public boolean sell(int stocks) {
        this.stocks -= stocks;
        return this.stocks == 0;
    }
}
