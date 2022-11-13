package com.example.myapplication.Portfolio;

import android.view.View;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.R;

public class PortfolioHeaderView extends RecyclerView.ViewHolder {

    final TextView netWorthView;

    final TextView CashBalView;

    public PortfolioHeaderView(View view) {
        super(view);
        netWorthView = (TextView) view.findViewById(R.id.portfolio_net_worth);
        CashBalView = (TextView) view.findViewById(R.id.portfolio_cash_bal);

    }
}