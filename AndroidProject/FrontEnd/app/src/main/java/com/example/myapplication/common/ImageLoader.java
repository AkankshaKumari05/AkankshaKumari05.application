package com.example.myapplication.common;

import android.content.Context;
import android.widget.ImageView;

import com.squareup.picasso.Picasso;

public class ImageLoader {

    public static void loadRounded(Context context, ImageView imageView, String url) {
        Picasso.with(context)
                .load(url)
                .transform(new RoundedCornersTransformation(30, 0))
                .fit()
                .into(imageView);
    }
    public static void load(Context context, ImageView imageView, String url) {
        Picasso.with(context)
                .load(url)
                .fit()
                .into(imageView);
    }


}