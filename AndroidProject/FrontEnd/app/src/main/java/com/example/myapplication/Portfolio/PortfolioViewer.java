package com.example.myapplication.Portfolio;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.widget.Button;
import android.widget.TextView;

import com.example.myapplication.Bean.DetailData;
import com.example.myapplication.Bean.PortfolioItem;
import com.example.myapplication.Bean.TransactionType;
import com.example.myapplication.R;
import com.example.myapplication.TradeTransaction.TradeDialog;
import com.example.myapplication.TradeTransaction.TradeSuccessDialog;
import com.example.myapplication.common.Storage;
import com.example.myapplication.common.StringFormatter;
import com.example.myapplication.common.ToastViewer;

import java.util.List;

public class PortfolioViewer implements TradeDialog.OnActionHandler {

    private final TextView sharedOwned;

    private final TextView avgCost;

    private final TextView totalCost;

    private final TextView change;

    private final TextView marketValue;

    private final TextView sharedOwnedTag;

    private final TextView avgCostTag;

    private final TextView totalCostTag;

    private final TextView changeTag;

    private final TextView marketValueTag;

    private final TradeDialog tradeDialog;

    private final TradeSuccessDialog tradeSuccessDialog;

    private final ToastViewer toastViewer;

    private final DetailData detailData;

    public PortfolioViewer(Activity activity, ToastViewer toastViewer, DetailData detailData) {
        sharedOwnedTag = activity.findViewById(R.id.port_Shares_Owned);
        avgCostTag = activity.findViewById(R.id.port_Avg_Cost);
        totalCostTag = activity.findViewById(R.id.port_Total_Cost);
        changeTag = activity.findViewById(R.id.port_Change);
        marketValueTag = activity.findViewById(R.id.port_market_val);
        sharedOwned = activity.findViewById(R.id.port_Shares_Owned_Val);
        avgCost = activity.findViewById(R.id.port_Avg_Cost_Val);
        totalCost = activity.findViewById(R.id.port_Total_Cost_Val);
        change = activity.findViewById(R.id.port_Change_Val);
        marketValue = activity.findViewById(R.id.port_market_val_Val);
        tradeDialog = new TradeDialog(activity, detailData, this);
        Button tradeButton = activity.findViewById(R.id.detail_portfolio_trade);
        tradeButton.setOnClickListener(v -> tradeDialog.show());
        tradeSuccessDialog = new TradeSuccessDialog(activity, detailData.getTicker());
        this.toastViewer = toastViewer;
        this.detailData = detailData;
    }

    @SuppressLint("SetTextI18n")
    public void display() {
        String sharedOwnedV = null;
        String totalCostV = null;
        String avgCostV=null;
        String marketVal = null;
        String changeV=null;
        int color = 0xFF000000;
        String ticker = detailData.getTicker();
        if (Storage.isPresentInPortfolio(ticker) && Storage.getPortfolioItem(ticker)!=null) {
            PortfolioItem item = Storage.getPortfolioItem(ticker);
            sharedOwnedV = StringFormatter.getQuantity(item.getStocks(),4);
            item.setLastPrice(detailData.getCurrentPrice());
            double temp = item.getWorth();
            totalCostV = StringFormatter.getPriceWithDollar(temp);
            marketVal = StringFormatter.getPriceWithDollar(item.getWorth());
            avgCostV = StringFormatter.getPriceWithDollar(item.getWorth()/item.getStocks());
            changeV = StringFormatter.getPrice(Math.abs(temp-item.getWorth()));
            color = temp-item.getWorth() > 0 ? 0xFF088B31 : 0xFFF62118 ;
            if (temp-item.getWorth() == 0){
                color = 0xFF000000;
            }
        } else {
            sharedOwnedV = "0";
            totalCostV = "$0.0";
            marketVal = "$0.0";
            avgCostV = "$0.0";
            changeV = "$0.0";
        }

        sharedOwnedTag.setText("Shares Owned:");
        avgCostTag.setText("Avg. Cost/Share:");
        totalCostTag.setText("Total Cost:");
        changeTag.setText("Change:");
        marketValueTag.setText("Market Value:");
        sharedOwned.setText(sharedOwnedV);
        avgCost.setText(avgCostV);
        totalCost.setText(totalCostV);
        change.setText(changeV);
        marketValue.setText(marketVal);
        change.setTextColor(color);
        marketValue.setTextColor(color);
    }

    @Override
    public void onStockBuy(Integer stocks) {
        if (stocks == null) {
            toastViewer.show("Please enter valid amount");
        } else if (stocks == 0) {
            toastViewer.show("Cannot buy less than 0 shares");
        } else {
            double balance = Storage.getBalance();
            double stocksPrice = getStocksPrice(stocks, detailData.getCurrentPrice());
            if (stocksPrice > balance) {
                toastViewer.show("Not enough money to buy");
            } else {
                buyStocks(stocks);
                onTradeSuccess(TransactionType.BUY, stocks);
            }
        }
    }

    private void buyStocks(Integer stocks) {
        String ticker = detailData.getTicker();
        double lastPrice = detailData.getCurrentPrice();

        PortfolioItem item;
        if (Storage.isPresentInPortfolio(ticker)) {
            List<PortfolioItem> items = Storage.getPortfolio();
            item = findItem(items, ticker);
            item.buy(stocks, lastPrice);
            Storage.updatePortfolio(items);
        } else {
            item = PortfolioItem.with(ticker, stocks, lastPrice);
            Storage.addToPortfolio(item);
        }

        Storage.updateBalance(Storage.getBalance() - getStocksPrice(stocks, lastPrice));
    }

    @Override
    public void onStockSell(Integer stocks) {
        if (stocks == null) {
            toastViewer.show("Please enter valid amount");
        } else if (stocks == 0) {
            toastViewer.show("Cannot sell less than 0 shares");
        } else {
            String ticker = detailData.getTicker();
            int portfolioStocks;
            if (Storage.isPresentInPortfolio(ticker)) {
                PortfolioItem item = Storage.getPortfolioItem(ticker);
                portfolioStocks = item.getStocks();
            } else {
                portfolioStocks = 0;
            }
            if (stocks > portfolioStocks) {
                toastViewer.show("Not enough shares to sell");
            } else {
                sellStocks(stocks);
                onTradeSuccess(TransactionType.SELL, stocks);
            }
        }
    }

    private void sellStocks(Integer stocks) {
        String ticker = detailData.getTicker();
        double lastPrice = detailData.getCurrentPrice();

        List<PortfolioItem> items = Storage.getPortfolio();
        PortfolioItem item = findItem(items, ticker);
        if (item.sell(stocks)) {
            items.remove(item);
        }
        Storage.updatePortfolio(items);

        Storage.updateBalance(Storage.getBalance() + getStocksPrice(stocks, lastPrice));
    }

    private PortfolioItem findItem(List<PortfolioItem> items, String ticker) {
        return items.stream().filter(item -> item.getTicker().equals(ticker)).findAny().orElse(null);
    }

    private void onTradeSuccess(TransactionType transactionType, int stocks) {
        tradeDialog.dismiss();
        display();
        tradeSuccessDialog.show(transactionType, stocks);
    }

    private double getStocksPrice(int stocks, double pricePerStock) {
        return stocks * pricePerStock;
    }
}