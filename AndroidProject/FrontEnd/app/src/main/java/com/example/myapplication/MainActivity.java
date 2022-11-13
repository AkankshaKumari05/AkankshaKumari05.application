package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.widget.NestedScrollView;

import com.example.myapplication.Controller.Controller;
import com.example.myapplication.Controller.ReqStatus;
import com.example.myapplication.Section.SectionsViewer;
import com.example.myapplication.common.AutocompleteResult;
import com.example.myapplication.common.JsonFormatter;
import com.example.myapplication.common.Logger;
import com.example.myapplication.common.SearchFilter;
import com.example.myapplication.common.Storage;
import com.example.myapplication.common.ToastViewer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = MainActivity.class.getSimpleName();

    private ConstraintLayout loadingLayout;
    private TextView errorView;
    private NestedScrollView successLayout;

    private TextView dateView;

    private ToastViewer toastViewer;

    private SearchFilter searchFilter;

    private SectionsViewer sectionsViewer;

    private Timer lastPricesFetchTimer;
    private static final int TIMER_DURATION_SECONDS = 60;

    private ReqStatus lastPricesFetchStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_MyApplication_NoActionBar);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeActionBar();

        loadingLayout = findViewById(R.id.loading);
        errorView = findViewById(R.id.loading_error);
        successLayout = findViewById(R.id.load_success);

        dateView = findViewById(R.id.current_date);

        toastViewer = new ToastViewer(this);

        Storage.initialize(this);
        Controller.initialize(this);

        sectionsViewer = new SectionsViewer(this, this);
    }

    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        Log.d(TAG, actionBar.toString());
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
        }
    }

    private void startDetailActivity(String ticker) {
        Intent intent = new Intent(this, DetailActivity.class);
        intent.putExtra("ticker", ticker);
        startActivity(intent);
    }

    private void showLoadingLayout() {
        Log.d(TAG, "showLoadingLayout");
        loadingLayout.setVisibility(View.VISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successLayout.setVisibility(View.INVISIBLE);
    }

    private void showErrorView() {
        Log.d(TAG, "showErrorView");
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.VISIBLE);
        successLayout.setVisibility(View.INVISIBLE);
    }

    private void showSuccessLayout() {
        Log.d(TAG, "showSuccessLayout");
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successLayout.setVisibility(View.VISIBLE);
    }

    private void startLastPricesFetchTimer() {
        Log.d(TAG, "Starting last prices fetch timer");
        lastPricesFetchTimer = new Timer();
        lastPricesFetchTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                Log.d(TAG, "Fetching last prices");
                Controller.cancelLastPricesFetchRequest();
                List<String> tickers = sectionsViewer.getTickers();
                if (tickers.size() > 0) {
                    Controller.makeLastPricesFetchRequest(tickers, response -> {
                        try {
                            JSONObject jsonData = response.getJSONObject("data");
                            Logger.logJSONObject(jsonData);
                            Log.d(TAG, "run: "+jsonData);
                            Map<String, Double> lastPrices = JsonFormatter.jsonToLastestPrices(jsonData.toString());
                            onLastPricesFetchSuccess(lastPrices);
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Log.d(TAG, "here: +e"+e);
                            onLastPricesFetchError();
                        }
                    }, error -> {
                        Logger.logError(error);
                        Log.d(TAG, "omg: "+error);
                        onLastPricesFetchError();
                    });
                } else {
                    runOnUiThread(() -> onLastPricesFetchSuccess(Collections.emptyMap()));
                }
            }
        }, 0, TimeUnit.SECONDS.toMillis(TIMER_DURATION_SECONDS));
    }

    private void onLastPricesFetchSuccess(Map<String, Double> lastPrices) {
        initializeDateView();
        sectionsViewer.updateSections(lastPrices);
        showSuccessLayout();
        lastPricesFetchStatus.success();
    }

    private void initializeDateView() {
        ZonedDateTime zonedDateTime = ZonedDateTime.of(LocalDateTime.now(), ZoneId.of("America/Los_Angeles"));
        String dateString = zonedDateTime.format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
        dateView.setText(dateString);
    }

    private void onLastPricesFetchError() {
        if (lastPricesFetchStatus.isLoading()) {
            // First load
            showErrorView();
            lastPricesFetchStatus.error();
        } else {
            toastViewer.show("Error occurred while refetching data");
        }
    }

    private void stopLastPricesFetchTimer() {
        Log.d(TAG, "Stopping last prices fetch timer");
        lastPricesFetchTimer.cancel();
        Controller.cancelLastPricesFetchRequest();
    }

    @Override
    protected void onResume() {
        super.onResume();
        sectionsViewer.initializeSections();
        lastPricesFetchStatus = new ReqStatus();
        lastPricesFetchStatus.loading();
        showLoadingLayout();
        startLastPricesFetchTimer();
    }

    @Override
    protected void onPause() {
        stopLastPricesFetchTimer();
        super.onPause();
    }

    @SuppressLint("RestrictedApi")
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);

        MenuItem searchMenu = menu.findItem(R.id.main_action_search);

        SearchView searchView = (SearchView) searchMenu.getActionView();

        final SearchView.SearchAutoComplete searchAutoComplete =
                searchView.findViewById(androidx.appcompat.R.id.search_src_text);

        searchFilter = new SearchFilter(this, android.R.layout.simple_dropdown_item_1line);

        searchAutoComplete.setAdapter(searchFilter);
        searchAutoComplete.setThreshold(3);

        int TRIGGER_AUTO_COMPLETE = 7;
        // Set to true when user clicks on an item in autocomplete to prevent autocomplete from triggering API request
        AtomicBoolean itemClicked = new AtomicBoolean(false);

        Handler handler = new Handler(message -> {
            if (message.what == TRIGGER_AUTO_COMPLETE) {
                String query = searchAutoComplete.getText().toString();
                if (!TextUtils.isEmpty(query) && query.length() > 2) {
                    Controller.fetchAutocompleteSearch(query, response -> {
                        try {
                            JSONArray jsonData = response.getJSONObject("resp").getJSONArray("result");
                            Logger.logJSONArray(jsonData);
                            Log.d(TAG, "here");
                            List<AutocompleteResult> autocompleteResults = JsonFormatter.jsonToSearchResultOptions(jsonData.toString());
                            Log.d(TAG, autocompleteResults.toString());
                            searchFilter.setItemsAndNotify(AutocompleteResult.getFormattedOptions(autocompleteResults));
                        } catch (JSONException e) {
                            e.printStackTrace();
                            onSearchOptionsRequestFailure(null);
                        }
                    }, error -> {
                        Logger.logError(error);
                        String errorMessage = null;
                        if (Controller.isNotFoundError(error)) {
                            errorMessage = "No results";
                        }
                        onSearchOptionsRequestFailure(errorMessage);
                    });
                } else {
                    searchFilter.clearItemsAndNotify();
                }
            }
            return false;
        });

        searchAutoComplete.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (itemClicked.get()) {
                    itemClicked.set(false);
                } else {
                    Controller.cancelSearchOptionsFetchRequest();
                    handler.removeMessages(TRIGGER_AUTO_COMPLETE);
                    handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE, 300);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        searchAutoComplete.setOnItemClickListener((adapterView, view, itemIndex, id) -> {
            String formattedSearchOption = (String) adapterView.getItemAtPosition(itemIndex);
            itemClicked.set(true);
            searchAutoComplete.setText(formattedSearchOption);
            String ticker = AutocompleteResult.extractTickerFromFormattedOption(formattedSearchOption);
            startDetailActivity(ticker);
        });

        return super.onCreateOptionsMenu(menu);
    }

    private void onSearchOptionsRequestFailure(String message) {
        searchFilter.clearItemsAndNotify();
        if (message == null) {
            message = "Error occurred while fetching search results";
        }
        toastViewer.show(message);
    }

    public void onFinClick(View view) {
        Uri uri = Uri.parse("https://www.finnhub.io");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }
}