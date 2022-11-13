package com.example.myapplication;


import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.core.widget.NestedScrollView;

import com.example.myapplication.Bean.Detail;
import com.example.myapplication.Bean.FavoritesItem;
import com.example.myapplication.Bean.DetailData;
import com.example.myapplication.Bean.Mention;
import com.example.myapplication.Bean.NewsItem;
import com.example.myapplication.Controller.Controller;
import com.example.myapplication.Controller.ReqStatus;
import com.example.myapplication.News.NewsViewer;
import com.example.myapplication.Portfolio.PortfolioViewer;
import com.example.myapplication.Section.AboutViewer;
import com.example.myapplication.Section.StatsViewer;
import com.example.myapplication.common.ImageLoader;
import com.example.myapplication.common.JsonFormatter;
import com.example.myapplication.common.Logger;
import com.example.myapplication.common.Storage;
import com.example.myapplication.common.StringFormatter;
import com.example.myapplication.common.ToastViewer;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Locale;

public class DetailActivity extends AppCompatActivity {
    private static final String TAG = DetailActivity.class.getSimpleName();

    private String ticker;

    private ConstraintLayout loadingLayout;
    private TextView errorView;
    private NestedScrollView successView;

    private ToastViewer toastViewer;

    private ReqStatus detailFetchStatus;

    private DetailData detailData;

    private Mention reddit;

    private Mention twitter;
    private ImageButton dailyChart;

    private ImageButton histChart;

    private WebView histChartView;

    private WebView dailyChartView;

    private Drawable dailyDrawable;

    private Drawable histDrawable;

    private View dailyShadow;

    private View histShadow;

    private String tabVal[]={"R.drawable.chart_line","R.drawable.clock"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_MyApplication_NoActionBar);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity);

        initializeActionBar();

        Intent intent = getIntent();
        if (!intent.hasExtra("ticker")) {
            throw new RuntimeException("DetailActivity needs ticker data in intent to run");
        }
        ticker = intent.getStringExtra("ticker");
        this.setTitle(ticker.toUpperCase(Locale.ROOT));
        loadingLayout = findViewById(R.id.detail_progress);
        errorView = findViewById(R.id.detail_error);
        successView = findViewById(R.id.detail_success);
        dailyChart = findViewById(R.id.chart_daily);
        histChart = findViewById(R.id.chart_hist);
        dailyChart.setOnClickListener(view -> showDailyChart());
        histChart.setOnClickListener(view -> showHistChart());
        histChartView = findViewById(R.id.his_chart);
        dailyChartView = findViewById(R.id.daily_chart);
        dailyDrawable = dailyChart.getBackground();
        dailyDrawable = DrawableCompat.wrap(dailyDrawable);
        histDrawable = histChart.getBackground();
        histDrawable = DrawableCompat.wrap(histDrawable);
        dailyShadow = findViewById(R.id.daily_shadow);
        histShadow = findViewById(R.id.hist_shadow);
        toastViewer = new ToastViewer(this);

        Storage.initialize(this);
        Controller.initialize(this);

        detailFetchStatus = new ReqStatus();
        detailFetchStatus.loading();

        showLoadingLayout();
        startDetailFetch();
    }

    private void showHistChart(){
        DrawableCompat.setTint(dailyDrawable, Color.BLACK);
        dailyChart.setBackground(dailyDrawable);
        DrawableCompat.setTint(histDrawable, Color.BLUE);
        histChart.setBackground(histDrawable);
        histShadow.setVisibility(View.VISIBLE);
        dailyShadow.setVisibility(View.INVISIBLE);
        histChartView.setVisibility(View.VISIBLE);
        dailyChartView.setVisibility(View.INVISIBLE);
    }

    private void showDailyChart(){
        DrawableCompat.setTint(dailyDrawable, Color.BLUE);
        dailyChart.setBackground(dailyDrawable);
        DrawableCompat.setTint(histDrawable, Color.BLACK);
        histChart.setBackground(histDrawable);
        dailyShadow.setVisibility(View.VISIBLE);
        histShadow.setVisibility(View.INVISIBLE);
        dailyChartView.setVisibility(View.VISIBLE);
        histChartView.setVisibility(View.INVISIBLE);
    }


    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.detail_toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
    }

    private void showLoadingLayout() {
        loadingLayout.setVisibility(View.VISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successView.setVisibility(View.INVISIBLE);
    }

    private void showErrorView() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.VISIBLE);
        successView.setVisibility(View.INVISIBLE);
    }

    private void startDetailFetch() {
        Controller.fetchDetails(ticker, response -> {
            try {
                JSONObject jsonData = response.getJSONObject("data");
                Detail detail = JsonFormatter.jsonToDetail(jsonData.toString());
                onDetailFetchSuccess(detail);
            } catch (JSONException e) {
                e.printStackTrace();
                onDetailFetchError();
            }
        }, error -> {
            Logger.logError(error);
            onDetailFetchError();
        });
    }

    private void onDetailFetchSuccess(Detail detail) {
        detailData = detail.getInfo();
        reddit = detail.getReddit();
        twitter = detail.getTwitter();
        initializeInfoView();
        initializeDailChartView();
        initializeHistChartView();
        showDailyChart();
        initializePortfolioView();
        initializeStatsView();
        initializeAboutView();
        initializeRecoTrendChartView();
        initializeHistEpsChartView();
        initializeNewsView(detail.getNews());
        showSuccessLayout();
        detailFetchStatus.success();
    }

    private void initializeInfoView() {
        ImageView logo= findViewById(R.id.company_logo);
        ImageLoader.load(this,logo, detailData.getLogo());
        TextView tickerView = findViewById(R.id.detail_ticker);
        tickerView.setText(ticker);
        TextView nameView = findViewById(R.id.detail_ticker_name);
        nameView.setText(detailData.getName());
        TextView lastPriceView = findViewById(R.id.detail_last_price);
        lastPriceView.setText(StringFormatter.getPriceWithDollar(detailData.getCurrentPrice()));
        TextView changeView = findViewById(R.id.detail_price_change);
        changeView.setText(StringFormatter.getPriceWithDollar(Math.abs(detailData.getChangePrice()))+"(" + StringFormatter.getPrice(Math.abs(detailData.getChangePercentage()))+"%)");
        changeView.setTextColor(getColor(detailData.getChangeColor()));
        ImageView detailTrend = findViewById(R.id.details_trending);
        if(detailData.getTrendingDrawable() == 0){
            detailTrend.setVisibility(View.VISIBLE);
        }
        else{
            detailTrend.setImageResource(detailData.getTrendingDrawable());
            detailTrend.setVisibility(View.VISIBLE);
        }
        TextView redTotal = findViewById(R.id.red_total);
        TextView redPos = findViewById(R.id.red_pos);
        TextView redNeg = findViewById(R.id.red_neg);
        TextView twitTotal = findViewById(R.id.twit_total);
        TextView twitPos = findViewById(R.id.twit_pos);
        TextView twitNeg = findViewById(R.id.twit_neg);
        redTotal.setText(reddit.getMention());
        redPos.setText(reddit.getPositiveMention());
        redNeg.setText(reddit.getNegativeMention());
        twitTotal.setText(twitter.getMention());
        twitPos.setText(twitter.getPositiveMention());
        twitNeg.setText(twitter.getNegativeMention());
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeHistChartView() {
        WebSettings settings = histChartView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        histChartView.loadUrl("file:///android_asset/histChart.html?ticker=" + ticker);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeDailChartView() {
        WebSettings settings = dailyChartView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        dailyChartView.loadUrl("file:///android_asset/dailyChart.html?ticker=" + ticker+"&change="+ detailData.getChangePrice());
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeRecoTrendChartView() {
        WebView recTrendChart = findViewById(R.id.recommendation_trends);
        WebSettings settings = recTrendChart.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        Log.d(TAG, "initializeChartView: here");
        recTrendChart.loadUrl("file:///android_asset/recTrend.html?ticker=" + ticker);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeHistEpsChartView() {
        WebView histEpsChart = findViewById(R.id.hist_eps_chart);
        WebSettings settings = histEpsChart.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        Log.d(TAG, "initializeChartView: here");
        histEpsChart.loadUrl("file:///android_asset/histEPSChart.html?ticker=" + ticker);
    }

    private void initializePortfolioView() {
        PortfolioViewer portfolioViewer = new PortfolioViewer(this, toastViewer, detailData);
        portfolioViewer.display();
    }

    private void initializeStatsView() {
        StatsViewer statsViewer = new StatsViewer(this, detailData);
        statsViewer.display();
    }

    private void initializeAboutView() {
        AboutViewer aboutViewer = new AboutViewer(this, this, detailData);
        aboutViewer.display();
    }

    private void initializeNewsView(List<NewsItem> news) {
        new NewsViewer(this, this, news);
    }

    private void onDetailFetchError() {
        showErrorView();
        detailFetchStatus.error();
    }

    private void showSuccessLayout() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successView.setVisibility(View.VISIBLE);
    }

    @Override
    protected void onDestroy() {
        Controller.cancelDetailFetchRequest();
        super.onDestroy();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.details, menu);
        MenuItem item = menu.findItem(R.id.detail_action_favorite);
        int icon = getFavoriteIcon(Storage.isFavorite(ticker));
        item.setIcon(icon);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == android.R.id.home) {
            onBackPressed();
            return true;
        } else if (itemId == R.id.detail_action_favorite) {
            onFavoriteClicked(item);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void onFavoriteClicked(MenuItem item) {
        if (detailFetchStatus.isLoading()) {
            toastViewer.show("Still fetching data");
        } else if (detailFetchStatus.isError()) {
            toastViewer.show("Failed to fetch data");
        } else {
            boolean isFavorite = Storage.isFavorite(ticker);
            if (isFavorite) {
                Storage.removeFromFavorites(ticker);
                toastViewer.show(String.format("\"%s\" was removed from favorites", ticker));
            } else {
                FavoritesItem favoritesItem = FavoritesItem.with(ticker, detailData.getName(), detailData.getCurrentPrice());
                Storage.addToFavorites(favoritesItem);
                toastViewer.show(String.format("\"%s\" was added to favorites", ticker));
            }
            int icon = getFavoriteIcon(!isFavorite);
            item.setIcon(icon);
        }
    }

    private int getFavoriteIcon(boolean isFavorite) {
        return isFavorite ? R.drawable.ic_baseline_star_24 : R.drawable.ic_baseline_star_border_24;
    }
}