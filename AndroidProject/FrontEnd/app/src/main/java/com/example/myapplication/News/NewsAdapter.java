package com.example.myapplication.News;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.Bean.NewsItem;
import com.example.myapplication.R;
import com.example.myapplication.common.ImageLoader;

import java.time.Instant;
import java.util.List;

public class NewsAdapter extends RecyclerView.Adapter<NewsView> {

    private static final int VIEW_TYPE_BIG = 0;

    private static final int VIEW_TYPE_SMALL = 1;

    private final Context context;

    private final List<NewsItem> items;

    private final OnActionHandler actionHandler;

    public interface OnActionHandler {
        void onNewsClick(NewsItem item);

        void onNewsLongClick(NewsItem item);
    }

    public NewsAdapter(Context context, List<NewsItem> items, OnActionHandler actionHandler) {
        this.context = context;
        this.items = items;
        this.actionHandler = actionHandler;
    }

    @NonNull
    @Override
    public NewsView onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        int layoutId;
        switch (viewType) {
            case VIEW_TYPE_BIG: {
                layoutId = R.layout.news_lg;
                break;
            }
            case VIEW_TYPE_SMALL: {
                layoutId = R.layout.news_sm;
                break;
            }
            default:
                throw new IllegalArgumentException("Invalid view type, value of " + viewType);
        }
        View view = LayoutInflater.from(context).inflate(layoutId, parent, false);
        view.setFocusable(true);
        return new NewsView(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NewsView holder, int position) {
        NewsItem item = items.get(position);
        ImageLoader.loadRounded(context, holder.imageView, item.getImageUrl());
        holder.publisherView.setText(item.getSource());
        long unixTime = Instant.now().getEpochSecond();
        long time = unixTime - Long.parseLong(item.getPublishedAt());
        holder.publishedAtView.setText(formatTime((int) time));
        holder.titleView.setText(item.getHeadline());
        holder.itemView.setOnClickListener(v -> actionHandler.onNewsClick(item));
        holder.itemView.setOnLongClickListener(v -> {
            actionHandler.onNewsLongClick(item);
            return true;
        });
    }

    private String formatTime(int time) {
        String Text="";
        if(time < 3600) {
            return "Less than hour ago";
        }
        else if(time >= 3600 && time < 86400) {
            int temp = (int) (time / 3600);
            return temp + " hours ago";
        }
        else{
            return "More than day ago";
        }
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public int getItemViewType(int position) {
        return position == 0 ? VIEW_TYPE_BIG : VIEW_TYPE_SMALL;
    }
}