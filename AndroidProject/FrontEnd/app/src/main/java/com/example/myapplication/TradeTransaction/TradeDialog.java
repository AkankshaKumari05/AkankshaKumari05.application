package com.example.myapplication.TradeTransaction;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.example.myapplication.Bean.DetailData;
import com.example.myapplication.R;
import com.example.myapplication.common.StringFormatter;
import com.example.myapplication.common.Storage;

public class TradeDialog {
    private final Dialog dialog;

    private final EditText stocksEditText;

    private final TextView stocksPriceView;

    private final OnActionHandler actionHandler;

    private final DetailData detailData;

    private Integer stocks;

    public interface OnActionHandler {
        void onStockBuy(Integer stocks);

        void onStockSell(Integer stocks);
    }

    public TradeDialog(Context context, DetailData detailData, OnActionHandler actionHandler) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.trading_module);

        stocksEditText = dialog.findViewById(R.id.trade_stocks);
        stocksPriceView = dialog.findViewById(R.id.trade_stocks_price);

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        this.detailData = detailData;

        this.actionHandler = actionHandler;

        initializeTitleText();
        initializeStocksEditText();
        initializeStocksPriceView();
        initializeBuyButton();
        initializeSellButton();
    }

    private void reset() {
        stocks = null;
        stocksEditText.setText("");
        initializeAvailableAmountView();
    }

    public void show() {
        reset();
        dialog.show();
    }

    public void dismiss() {
        dialog.dismiss();
    }

    private void initializeTitleText() {
        TextView titleView = dialog.findViewById(R.id.trade_title);
        titleView.setText(String.format("Trade %s shares", detailData.getName()));
    }

    private void initializeStocksEditText() {
        stocksEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (s.length() == 0) {
                    stocks = null;
                } else {
                    try {
                        stocks = Integer.parseInt(s.toString());
                    } catch (NumberFormatException e) {
                        stocks = null;
                    }
                }
                initializeStocksPriceView();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

    @SuppressLint("DefaultLocale")
    private void initializeStocksPriceView() {
        String lastPriceString = StringFormatter.getPriceWithDollar(detailData.getCurrentPrice());
        int displayStocks = stocks == null ? 0 : stocks;
        String stocksPriceString = StringFormatter.getPriceWithDollar(displayStocks * detailData.getCurrentPrice());
        stocksPriceView.setText(String.format("%d x %s/share = %s", displayStocks, lastPriceString, stocksPriceString));
    }

    private void initializeAvailableAmountView() {
        TextView availableAmountView = dialog.findViewById(R.id.trade_available_amount);
        String balanceString = StringFormatter.getPriceWithDollar(Storage.getBalance());
        availableAmountView.setText(String.format("%s available to buy %s", balanceString, detailData.getTicker()));
    }

    private void initializeBuyButton() {
        Button buyButton = dialog.findViewById(R.id.trade_buy);
        buyButton.setOnClickListener(v -> this.actionHandler.onStockBuy(stocks));
    }

    public void initializeSellButton() {
        Button sellButton = dialog.findViewById(R.id.trade_sell);
        sellButton.setOnClickListener(v -> this.actionHandler.onStockSell(stocks));
    }
}