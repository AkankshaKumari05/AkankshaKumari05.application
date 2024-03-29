package com.example.myapplication.Section;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.Bean.FavoritesItem;
import com.example.myapplication.Bean.PortfolioItem;
import com.example.myapplication.DetailActivity;
import com.example.myapplication.Favorites.FavoritesSection;
import com.example.myapplication.Portfolio.PortfolioSection;
import com.example.myapplication.R;
import com.example.myapplication.common.Storage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class SectionsViewer implements PortfolioSection.OnClickHandler, FavoritesSection.OnClickHandler,
        SectionCallback.OnActionHandler {

    private final Context context;

    private final SectionedRecyclerViewAdapter adapter;

    private final PortfolioSection portfolioSection;

    private final FavoritesSection favoritesSection;

    private final SectionAdapter portfolioAdapter;

    private final SectionAdapter favoritesAdapter;

    public SectionsViewer(Activity activity, Context context) {
        this.context = context;
        adapter = new SectionedRecyclerViewAdapter();
        portfolioSection = new PortfolioSection(context, this);
        favoritesSection = new FavoritesSection(context, this);
        adapter.addSection(portfolioSection);
        adapter.addSection(favoritesSection);
        portfolioAdapter = adapter.getAdapterForSection(portfolioSection);
        favoritesAdapter = adapter.getAdapterForSection(favoritesSection);
        initializeRecyclerView(activity);
    }

    private void initializeRecyclerView(Activity activity) {
        RecyclerView recyclerView = activity.findViewById(R.id.main_page);
        recyclerView.addItemDecoration(new DividerItemDecoration(context, DividerItemDecoration.VERTICAL));
        recyclerView.setLayoutManager(new LinearLayoutManager(context));
        recyclerView.setAdapter(adapter);
        SectionCallback callback = new SectionCallback(context, adapter, this);
        ItemTouchHelper helper = new ItemTouchHelper(callback);
        helper.attachToRecyclerView(recyclerView);
    }

    public void initializeSections() {
        portfolioSection.setBalance(Storage.getBalance());
        portfolioSection.setItems(Storage.getPortfolio());
        favoritesSection.setItems(Storage.getFavorites());
        adapter.notifyDataSetChanged();
    }

    public void updateSections(Map<String, Double> lastPrices) {
        updatePortfolio(lastPrices);
        Map<String, Integer> stocks = portfolioSection.getItems().stream().collect(
                Collectors.toMap(PortfolioItem::getTicker, PortfolioItem::getStocks));
        updateFavorites(lastPrices, stocks);
    }

    private void updatePortfolio(Map<String, Double> lastPrices) {
        portfolioSection.updateItems(lastPrices);
        portfolioAdapter.notifyAllItemsChanged();
        portfolioAdapter.notifyHeaderChanged();
    }

    private void updateFavorites(Map<String, Double> lastPrices, Map<String, Integer> stocks) {
        favoritesSection.updateItems(lastPrices, stocks);
        favoritesAdapter.notifyAllItemsChanged();
    }

    @Override
    public void onFavoritesItemClick(FavoritesItem item) {
        String ticker = item.getTicker();
        startDetailActivity(ticker);
    }

    @Override
    public void onPortfolioItemClick(PortfolioItem item) {
        String ticker = item.getTicker();
        startDetailActivity(ticker);
    }

    @Override
    public void onFavoritesItemSwipe(int position) {
        FavoritesItem item = favoritesSection.getItem(position);
        favoritesSection.removeItem(position);
        favoritesAdapter.notifyItemRemoved(position);
        Storage.removeFromFavorites(item.getTicker());
    }

    @Override
    public void onFavoritesItemMove(int fromPosition, int toPosition) {
        favoritesSection.moveItem(fromPosition, toPosition);
        favoritesAdapter.notifyItemMoved(fromPosition, toPosition);
        Storage.updateFavorites(favoritesSection.getItems());
    }

    @Override
    public void onPortfolioItemMove(int fromPosition, int toPosition) {
        portfolioSection.moveItem(fromPosition, toPosition);
        portfolioAdapter.notifyItemMoved(fromPosition, toPosition);
        Storage.updatePortfolio(portfolioSection.getItems());
    }

    public List<String> getTickers() {
        Set<String> tickers = getPortfolioTickers();
        tickers.addAll(getFavoritesTickers());
        return new ArrayList<>(tickers);
    }

    private Set<String> getPortfolioTickers() {
        return portfolioSection.getItems().stream().map(PortfolioItem::getTicker).collect(Collectors.toSet());
    }

    private Set<String> getFavoritesTickers() {
        return favoritesSection.getItems().stream().map(FavoritesItem::getTicker).collect(Collectors.toSet());
    }

    private void startDetailActivity(String ticker) {
        Intent intent = new Intent(context, DetailActivity.class);
        intent.putExtra("ticker", ticker);
        context.startActivity(intent);
    }
}