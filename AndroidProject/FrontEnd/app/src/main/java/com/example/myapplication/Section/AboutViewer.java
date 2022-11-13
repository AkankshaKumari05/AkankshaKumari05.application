package com.example.myapplication.Section;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.TextView;

import com.example.myapplication.Bean.DetailData;
import com.example.myapplication.DetailActivity;
import com.example.myapplication.R;


public class AboutViewer {
    private final TextView ipo;

    private final TextView industry;

    private final TextView webpage;

    private final TextView compeers;

    private final TextView ipoVal;

    private final TextView industryVal;

    private final TextView webpageVal;

    private final TextView compeersVal;

    private final DetailData detailData;

    private final Context context;

    public AboutViewer(Activity activity, Context context, DetailData detailData) {
        ipo = activity.findViewById(R.id.about_ipo);
        industry = activity.findViewById(R.id.about_industry);
        webpage = activity.findViewById(R.id.about_Webpage);
        compeers = activity.findViewById(R.id.about_company_peers);
        ipoVal = activity.findViewById(R.id.about_ipo_val);
        industryVal = activity.findViewById(R.id.about_indus_val);
        webpageVal = activity.findViewById(R.id.about_webpage_val);
        webpageVal.setOnClickListener(view -> view(detailData.getWebPage()));
        compeersVal = activity.findViewById(R.id.about_company_peers_val);
        compeersVal.setOnClickListener(view -> startDetailActivity(detailData.getPeers()[4]));
        this.detailData = detailData;
        this.context = context;
    }

    private void startDetailActivity(String ticker) {
            Intent intent = new Intent(context, DetailActivity.class);
            intent.putExtra("ticker", ticker);
            context.startActivity(intent);
    }

    private void view(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        context.startActivity(intent);
    }

    @SuppressLint("SetTextI18n")
    public void display() {
        ipo.setText("IPO Start Date");
        industry.setText("Industry");
        webpage.setText("Webpage");
        compeers.setText("Company Peers");
        ipoVal.setText(detailData.getIpo());
        industryVal.setText(detailData.getIndustry());
        webpageVal.setText(detailData.getWebPage());
        webpageVal.setTextColor(0xFF0164A5);
        String[] peers = detailData.getPeers();
        String peer="";
        for(String p: peers) {
            peer = peer.concat(p);
            peer = peer.concat(",");
        }
        compeersVal.setText(peer);
        compeersVal.setTextColor(0xFF0164A5);
    }
}