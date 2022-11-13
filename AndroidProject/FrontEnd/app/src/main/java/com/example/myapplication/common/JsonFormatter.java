package com.example.myapplication.common;

import com.example.myapplication.Bean.Detail;
import com.example.myapplication.Bean.FavoritesItem;
import com.example.myapplication.Bean.PortfolioItem;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

public class JsonFormatter {

    public static List<AutocompleteResult> jsonToSearchResultOptions(String json) {
        return gson.fromJson(json, new TypeToken<List<AutocompleteResult>>() {
        }.getType());
    }

    private static final Gson gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();

    private static final Type favoritesItems = new TypeToken<List<FavoritesItem>>() {
    }.getType();

    private static final Type portfolioItems = new TypeToken<List<PortfolioItem>>() {
    }.getType();

    public static Map<String, Double> jsonToLastestPrices(String json) {
        return gson.fromJson(json, new TypeToken<Map<String, Double>>() {
        }.getType());
    }

    public static double jsonToBalance(String json) {
        return gson.fromJson(json, Double.class);
    }

    public static String balanceToJson(double balance) {
        return gson.toJson(balance, Double.class);
    }

    public static List<FavoritesItem> jsonToFavorites(String fav) {
        return gson.fromJson(fav, favoritesItems);
    }

    public static String favoritesToJson(List<FavoritesItem> items) {
        return gson.toJson(items, favoritesItems);
    }

    public static List<PortfolioItem> jsonToPortfolio(String json) {
        return gson.fromJson(json, portfolioItems);
    }

    public static String portfolioToJson(List<PortfolioItem> items) {
        return gson.toJson(items, portfolioItems);
    }

    public static Detail jsonToDetail(String json) {
        return gson.fromJson(json, Detail.class);
    }
}
