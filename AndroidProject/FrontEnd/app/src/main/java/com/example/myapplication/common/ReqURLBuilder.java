package com.example.myapplication.common;
import android.net.Uri;

public class ReqURLBuilder {
    private static final String BASE_URL = "https://stock-search-bandroid-server.wl.r.appspot.com/";

    private final Uri.Builder uriBuilder;

    public ReqURLBuilder() {
        uriBuilder = Uri.parse(BASE_URL).buildUpon();
    }

    public String build() {
        return uriBuilder.build().toString();
    }

    public ReqURLBuilder path(String path) {
        uriBuilder.encodedPath(path);
        return this;
    }
}