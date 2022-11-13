package com.example.myapplication.Portfolio;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.R;
import com.example.myapplication.Section.SectionView;
import com.example.myapplication.Bean.SectionViewType;

public class PortfolioItemView extends RecyclerView.ViewHolder implements SectionView {

    final TextView tickerView;

    final TextView shareCountView;

    final TextView lastPriceView;

    final TextView changeView;

    final ImageView trendingView;

    final ImageView arrowView;

    public PortfolioItemView(View view) {
        super(view);
        tickerView = (TextView) view.findViewById(R.id.portfolio_ticker);
        shareCountView = (TextView) view.findViewById(R.id.portfolio_shareCount);
        lastPriceView = (TextView) view.findViewById(R.id.portfolio_last_price);
        changeView = (TextView) view.findViewById(R.id.portfolio_change);
        trendingView = (ImageView) view.findViewById(R.id.portfolio_trending);
        arrowView = (ImageView) view.findViewById(R.id.portfolio_arrow);
    }

    @Override
    public SectionViewType getType() {
        return SectionViewType.PORTFOLIO;
    }
}