package com.example.myapplication.News;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.widget.ImageButton;
import android.widget.TextView;

import com.example.myapplication.Bean.NewsItem;
import com.example.myapplication.R;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.TimeZone;

public class NewsModal {
    private final Context context;

    private final Dialog dialog;

    private final TextView titleView;

    private final TextView sourceView;

    private final TextView dateView;

    private final TextView descriptionView;

    private final OnActionHandler actionHandler;

    private NewsItem item;

    interface OnActionHandler {
        void onNewsFacebookShare(NewsItem item);
        void onNewsView(NewsItem item);
        void onNewsTwitterShare(NewsItem item);
    }

    public NewsModal(Context context, OnActionHandler actionHandler) {
        this.context = context;

        dialog = new Dialog(context);
        dialog.setContentView(R.layout.news_modal);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        sourceView = dialog.findViewById(R.id.news_modal_source);
        dateView = dialog.findViewById(R.id.news_modal_date);
        titleView = dialog.findViewById(R.id.news_modal_title);
        descriptionView = dialog.findViewById(R.id.news_modal_description);

        this.actionHandler = actionHandler;

        initializeTwitterShareButton();
        initializeFacebookShareButton();
        initializeViewButton();
    }

    private void reset(NewsItem item) {
        this.item = item;
        initializeTitleText();
        initializeDateVal();
        initializeSourceVal();
        initializeDescription();
    }

    public void show(NewsItem item) {
        reset(item);
        dialog.show();
    }

    private void initializeTitleText() {
        titleView.setText(item.getHeadline());
    }
    private void initializeDateVal() {
        LocalDateTime time=LocalDateTime.ofInstant(Instant.ofEpochSecond(Long.parseLong(item.getPublishedAt())), TimeZone.getDefault().toZoneId());
        ZonedDateTime date = ZonedDateTime.of(time, ZoneId.of("America/Los_Angeles"));
        String dateString = date.format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
        dateView.setText(dateString);
    }
    private void initializeSourceVal() {sourceView.setText(item.getSource());}
    private void initializeDescription() {
        descriptionView.setText(item.getSummary());
    }

    private void initializeTwitterShareButton() {
        ImageButton shareButton = dialog.findViewById(R.id.news_dialog_share_twitter);
        shareButton.setOnClickListener(v -> this.actionHandler.onNewsTwitterShare(item));
    }

    public void initializeViewButton() {
        ImageButton viewButton = dialog.findViewById(R.id.news_dialog_chrome);
        viewButton.setOnClickListener(v -> this.actionHandler.onNewsView(item));
    }

    private void initializeFacebookShareButton(){
        ImageButton shareButton = dialog.findViewById(R.id.news_dialog_share_facebook);
        shareButton.setOnClickListener(v -> this.actionHandler.onNewsFacebookShare(item));
    }

}
