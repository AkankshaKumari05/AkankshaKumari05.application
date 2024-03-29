package com.example.myapplication.common;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import com.example.myapplication.Bean.FavoritesItem;
import com.example.myapplication.Bean.PortfolioItem;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class Storage {
    private static boolean initialized;

    private static SharedPreferences preferences;

    private static final String PREFERENCES_FILE_NAME = "PREFERENCES_FILE_NAME";

    private static final String BALANCE_KEY = "BALANCE_KEY";
    private static final double DEFAULT_BALANCE = 25000;

    private static final String FAVORITES_KEY = "FAVORITES_KEY";

    private static final String PORTFOLIO_KEY = "PORTFOLIO_KEY";

    synchronized public static void initialize(Context context) {
        if (!initialized) {
            initialized = true;
            preferences = context.getSharedPreferences(PREFERENCES_FILE_NAME, Context.MODE_PRIVATE);
            initializeBalance();
            initializePortfolio();
            initializeFavorites();
        }
    }

    private static void initializeBalance() {
        double balance = getBalance();
        updateBalance(balance);
    }

    public static double getBalance() {
        if (preferences.contains(BALANCE_KEY)) {
            return JsonFormatter.jsonToBalance(preferences.getString(BALANCE_KEY, null));
        }
        return DEFAULT_BALANCE;
    }

    synchronized public static void updateBalance(double balance) {
        String json = JsonFormatter.balanceToJson(balance);
        updatePreference(BALANCE_KEY, json);
    }

    private static void initializeFavorites() {
        List<FavoritesItem> favoritesItems = getFavorites();
        updateFavorites(favoritesItems);
    }

    public static List<FavoritesItem> getFavorites() {
        if (preferences.contains(FAVORITES_KEY)) {
            return JsonFormatter.jsonToFavorites(preferences.getString(FAVORITES_KEY, null));
        }
        return Collections.emptyList();
    }

    public static boolean isFavorite(String ticker) {
        List<FavoritesItem> items = getFavorites();
        return items.stream().anyMatch(favoritesItem -> favoritesItem.getTicker().equals(ticker));
    }

    synchronized public static void addToFavorites(FavoritesItem item) {
        List<FavoritesItem> items = getFavorites();
        items.add(item);
        updateFavorites(items);
    }

    synchronized public static void removeFromFavorites(String ticker) {
        List<FavoritesItem> items = getFavorites()
                .stream()
                .filter(item -> !item.getTicker().equals(ticker))
                .collect(Collectors.toList());
        updateFavorites(items);
    }

    public static void updateFavorites(List<FavoritesItem> items) {
        String json = JsonFormatter.favoritesToJson(items);
        updatePreference(FAVORITES_KEY, json);
    }

    private static void initializePortfolio() {
        List<PortfolioItem> portfolioItems = getPortfolio();
        updatePortfolio(portfolioItems);
    }

    public static List<PortfolioItem> getPortfolio() {
        if (preferences.contains(PORTFOLIO_KEY)) {
            return JsonFormatter.jsonToPortfolio(preferences.getString(PORTFOLIO_KEY, null));
        }
        return Collections.emptyList();
    }

    public static PortfolioItem getPortfolioItem(String ticker) {
        List<PortfolioItem> items = getPortfolio();
        return items.stream().filter(item -> item.getTicker().equals(ticker)).findAny().orElse(null);
    }

    public static boolean isPresentInPortfolio(String ticker) {
        List<PortfolioItem> items = getPortfolio();
        return items.stream().anyMatch(portfolioItem -> portfolioItem.getTicker().equals(ticker));
    }

    synchronized public static void addToPortfolio(PortfolioItem item) {
        List<PortfolioItem> items = getPortfolio();
        items.add(item);
        updatePortfolio(items);
    }

    public static void updatePortfolio(List<PortfolioItem> items) {
        String json = JsonFormatter.portfolioToJson(items);
        updatePreference(PORTFOLIO_KEY, json);
    }

    @SuppressLint("ApplySharedPref")
    private static void updatePreference(String key, String json) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, json);
        editor.commit();
    }
}
