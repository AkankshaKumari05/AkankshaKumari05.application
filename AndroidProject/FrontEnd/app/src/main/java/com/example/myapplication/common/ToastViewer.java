package com.example.myapplication.common;

import android.content.Context;
import android.widget.Toast;

public class ToastViewer {
    private final Context context;
    private Toast toast;

    public ToastViewer(Context context) {
        this.context = context;
    }

    public void show(String message) {
        if (this.toast != null) {
            this.toast.cancel();
        }
        this.toast = Toast.makeText(context, message, Toast.LENGTH_SHORT);
        this.toast.show();
    }
}
