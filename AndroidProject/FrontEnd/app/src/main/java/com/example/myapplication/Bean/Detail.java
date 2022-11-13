package com.example.myapplication.Bean;

import java.util.List;

public class Detail {
    private DetailData detailData;
    private List<NewsItem> news;
    private Mention reddit;
    private Mention twitter;

    public DetailData getInfo() {
        return detailData;
    }

    public List<NewsItem> getNews() {
       return news;
    }

    public Mention getReddit(){ return reddit;}

    public Mention getTwitter(){ return twitter;}
}

