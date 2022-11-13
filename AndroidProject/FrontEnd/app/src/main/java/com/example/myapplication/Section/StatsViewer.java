package com.example.myapplication.Section;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.widget.TextView;

import com.example.myapplication.Bean.DetailData;
import com.example.myapplication.R;
import com.example.myapplication.common.StringFormatter;

public class StatsViewer {
    private final TextView open;

    private final TextView high;

    private final TextView low;

    private final TextView prev;

    private final DetailData detailData;

    public StatsViewer(Activity activity, DetailData detailData) {
        open = activity.findViewById(R.id.stat_Open);
        high = activity.findViewById(R.id.stat_High);
        low = activity.findViewById(R.id.stat_Low);
        prev = activity.findViewById(R.id.stat_Prev);
        this.detailData = detailData;
    }

    @SuppressLint("SetTextI18n")
    public void display() {
        open.setText("Open Price:"+ StringFormatter.getPriceWithDollar(detailData.getOpenPrice()));
        high.setText("High Price:"+ StringFormatter.getPriceWithDollar(detailData.getHighPrice()));
        low.setText("Low Price:"+ StringFormatter.getPriceWithDollar(detailData.getLowPrice()));
        prev.setText("Prev. Close:"+ StringFormatter.getPriceWithDollar(detailData.getPrevClose()));
    }


}
