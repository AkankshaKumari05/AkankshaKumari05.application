package com.example.myapplication.Bean;

public class NewsItem {

    private String source;
    private String datetime;
    private String headline;
    private String summary;
    private String image;
    private String url;

    public String getSource() {
        return source;
    }

    public String getPublishedAt() {
        return datetime;
    }

    public String getHeadline() {
        return headline;
    }

    public String getSummary() {
        return summary;
    }

    public String getImageUrl() { return image; }

    public String getUrl() {
        return url;
    }
}
