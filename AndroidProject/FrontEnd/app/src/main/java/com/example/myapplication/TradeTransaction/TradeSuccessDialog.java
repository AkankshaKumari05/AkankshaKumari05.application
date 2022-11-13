package com.example.myapplication.TradeTransaction;

import android.app.Dialog;
import android.content.Context;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import com.example.myapplication.Bean.TransactionType;
import com.example.myapplication.R;
import com.example.myapplication.common.StringFormatter;

public class TradeSuccessDialog {
    private final String ticker;

    private final Dialog dialog;

    private final TextView messageView;

    public TradeSuccessDialog(Context context, String ticker) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.transaction);

        messageView = dialog.findViewById(R.id.trade_message);
        Button button = dialog.findViewById(R.id.trade_done);
        button.setOnClickListener(v -> dialog.dismiss());

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        this.ticker = ticker;
    }

    public void show(TransactionType transactionType, int stocks) {
        String tradeString = transactionType.equals(TransactionType.BUY) ? "bought" : "sold";
        String stocksString = StringFormatter.getQuantity(stocks, 0);
        String sharesString = stocks < 2 ? "share" : "shares";
        messageView.setText(String.format(
                "You have successfully %s %s %s of %s", tradeString, stocksString, sharesString, ticker));
        dialog.show();
    }
}