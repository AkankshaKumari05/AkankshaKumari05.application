package com.example.myapplication.Favorites;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.Bean.SectionViewType;
import com.example.myapplication.R;
import com.example.myapplication.Section.SectionView;

public class FavoritesItemView extends RecyclerView.ViewHolder implements SectionView {
    final TextView tickerView;

    final TextView descriptionView;

    final TextView lastPriceView;

    final TextView changeView;

    final ImageView trendingView;

    final ImageView arrowView;

    public FavoritesItemView(View view) {
        super(view);
        tickerView = (TextView) view.findViewById(R.id.favorites_ticker);
        descriptionView = (TextView) view.findViewById(R.id.favorites_description);
        lastPriceView = (TextView) view.findViewById(R.id.favorites_last_price);
        changeView = (TextView) view.findViewById(R.id.favorites_change);
        trendingView = (ImageView) view.findViewById(R.id.favorites_trending);
        arrowView = (ImageView) view.findViewById(R.id.favorites_arrow);
    }

    @Override
    public SectionViewType getType() {
        return SectionViewType.FAVORITES;
    }
}