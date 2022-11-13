package com.example.myapplication.News;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.Bean.NewsItem;
import com.example.myapplication.R;

import java.util.List;

public class NewsViewer implements NewsAdapter.OnActionHandler, NewsModal.OnActionHandler {

    private final Context context;

    private final NewsModal dialog;

    public NewsViewer(Activity activity, Context context, List<NewsItem> news) {
        RecyclerView recyclerView = activity.findViewById(R.id.news_detail);
        LinearLayoutManager layoutManager =
                new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(layoutManager);
        NewsAdapter adapter = new NewsAdapter(context, news, this);
        recyclerView.setAdapter(adapter);
        dialog = new NewsModal(context, this);
        this.context = context;
    }

    @Override
    public void onNewsClick(NewsItem item) {
        dialog.show(item);
    }

    @Override
    public void onNewsLongClick(NewsItem item) {
        dialog.show(item);
    }

    @Override
    public void onNewsTwitterShare(NewsItem item) {
        String url = getTwitterShareURL(item.getUrl());
        view(url);
    }
    @Override
    public void onNewsFacebookShare(NewsItem item) {
        String url = "https://www.facebook.com/sharer/sharer.php?u=".concat(item.getUrl() +" &amp;src=sdkpreparse");
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        context.startActivity(intent);

    }

    @Override
    public void onNewsView(NewsItem item) {
        view(item.getUrl());
    }

    private String getTwitterShareURL(String url) {
        return (new Uri.Builder())
                .scheme("https")
                .encodedAuthority("twitter.com")
                .encodedPath("intent/tweet")
                .appendQueryParameter("text", "Check out this Link:")
                .appendQueryParameter("url", url)
                .build()
                .toString();
    }

    private void view(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        context.startActivity(intent);
    }
}
