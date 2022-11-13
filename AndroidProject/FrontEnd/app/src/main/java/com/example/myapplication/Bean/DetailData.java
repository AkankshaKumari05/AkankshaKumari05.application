package com.example.myapplication.Bean;

import com.example.myapplication.R;

public class DetailData {
    private String ticker;
    private String name;
    private String logo;
    private Double changePrice;
    private Double changePercentage;
    private Double currentPrice;
    private Double highPrice;
    private Double lowPrice;
    private Double openPrice;
    private Double prevClose;
    private String ipo;
    private String industry;
    private String webPage;
    private String[] peers;

    public String getTicker() {
        return ticker;
    }

    public String getName() {
        return name;
    }

    public String getLogo() {
        return logo;
    }

    public Double getChangePrice() { return changePrice; }

    public Double getChangePercentage() {
        return changePercentage;
    }

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public Double getHighPrice() {
        return highPrice;
    }

    public Double getLowPrice() {
        return lowPrice;
    }

    public Double getOpenPrice() {
        return openPrice;
    }

    public Double getPrevClose() {
        return prevClose;
    }

    public String getIpo() {
        return ipo;
    }

    public String getIndustry() {
        return industry;
    }

    public String getWebPage(){
        return webPage;
    }

    public String[] getPeers(){ return peers;}

    public Integer getTrendingDrawable() {

        if (Math.abs(changePrice) < 0.01) {
            return 0;
        }
        return changePrice < 0 ? R.drawable.ic_baseline_trending_down_24 : R.drawable.ic_trending_up_24;
    }

    public int getChangeColor() {
        if (Math.abs(changePrice) < 0.01) {
            return R.color.grey_500;
        }
        return changePrice < 0 ? R.color.red : R.color.green;
    }
}
