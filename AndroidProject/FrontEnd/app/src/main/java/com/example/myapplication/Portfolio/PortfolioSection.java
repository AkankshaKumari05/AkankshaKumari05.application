package com.example.myapplication.Portfolio;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.Bean.PortfolioItem;
import com.example.myapplication.R;
import com.example.myapplication.common.Storage;
import com.example.myapplication.common.StringFormatter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;

public class PortfolioSection extends Section {
    private final Context context;
    private Double balance;
    private List<PortfolioItem> items;
    private final OnClickHandler clickHandler;

    public interface OnClickHandler {
        void onPortfolioItemClick(PortfolioItem item);
    }

    public PortfolioSection(Context context, OnClickHandler clickHandler) {
        super(SectionParameters.builder()
                .itemResourceId(R.layout.portfolio_body)
                .headerResourceId(R.layout.portfolio_header)
                .build());
        this.context = context;
        this.balance = null;
        this.items = new ArrayList<>();
        this.clickHandler = clickHandler;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void setItems(List<PortfolioItem> items) {
        this.items = items;
    }

    public void updateItems(Map<String, Double> lastPrices) {
        items.forEach(item -> item.setLastPrice(lastPrices.get(item.getTicker())));
    }

    public List<PortfolioItem> getItems() {
        return items;
    }

    public void moveItem(int fromPosition, int toPosition) {
        if (fromPosition < toPosition) {
            for (int i = fromPosition; i < toPosition; i++) {
                Collections.swap(items, i, i + 1);
            }
        } else {
            for (int i = fromPosition; i > toPosition; i--) {
                Collections.swap(items, i, i - 1);
            }
        }
    }

    @Override
    public int getContentItemsTotal() {
        return items.size();
    }

    @Override
    public RecyclerView.ViewHolder getItemViewHolder(View view) {
        return new PortfolioItemView(view);
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(View view) {
        return new PortfolioHeaderView(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindItemViewHolder(RecyclerView.ViewHolder holder, int position) {
        PortfolioItemView viewHolder = (PortfolioItemView) holder;
        PortfolioItem item = items.get(position);
        viewHolder.tickerView.setText(item.getTicker());
        viewHolder.shareCountView.setText(item.getShareCount());
        if (item.hasLastPrice()) {
            viewHolder.lastPriceView.setText(StringFormatter.getPriceWithDollar(item.getLastPrice()));
            viewHolder.changeView.setText(StringFormatter.getPriceWithDollar(item.getAbsoluteChange())+"("+StringFormatter.getPrice(item.getChangePercentage())+"%)");
            viewHolder.changeView.setTextColor(context.getColor(item.getChangeColor()));
            if (item.hasPriceChanged()) {
                viewHolder.trendingView.setImageResource(item.getTrendingDrawable());
                viewHolder.trendingView.setVisibility(View.VISIBLE);
            } else {
                viewHolder.trendingView.setVisibility(View.INVISIBLE);
            }
        }
        viewHolder.itemView.setOnClickListener(v -> clickHandler.onPortfolioItemClick(item));
    }

    @Override
    public void onBindHeaderViewHolder(RecyclerView.ViewHolder holder) {
        PortfolioHeaderView viewHolder = (PortfolioHeaderView) holder;
        Double netWorth = getNetWorth();
        if (netWorth != null) {
            viewHolder.netWorthView.setText(StringFormatter.getPriceWithDollar(netWorth));
            viewHolder.CashBalView.setText(StringFormatter.getPriceWithDollar(Storage.getBalance()));
        }
    }

    private Double getNetWorth() {
        if (balance == null) {
            return null;
        }
        double netWorth = balance;
        for (PortfolioItem item: items) {
            if (!item.hasLastPrice()) {
                return null;
            }
            netWorth += item.getWorth();
        }
        return netWorth;
    }
}