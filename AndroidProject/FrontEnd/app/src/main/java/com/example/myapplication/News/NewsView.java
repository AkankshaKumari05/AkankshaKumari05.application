package com.example.myapplication.News;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.R;

public class NewsView extends RecyclerView.ViewHolder {
    final ImageView imageView;

    final TextView publisherView;

    final TextView publishedAtView;

    final TextView titleView;

    public NewsView(@NonNull View itemView) {
        super(itemView);

        imageView = itemView.findViewById(R.id.news_image);
        publisherView = itemView.findViewById(R.id.news_publisher);
        publishedAtView = itemView.findViewById(R.id.news_published_at);
        titleView = itemView.findViewById(R.id.news_title);
    }
}
