package com.example.myapplication.common;

import android.content.Context;
import android.util.AttributeSet;

public class ViewGrid extends android.widget.GridView {

    public ViewGrid(Context context) {
        super(context);
    }

    public ViewGrid(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ViewGrid(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasSpec, int heightMeasSpec) {
        int heightSpec = heightMeasSpec;
        if (getLayoutParams().height == LayoutParams.WRAP_CONTENT) {
            heightSpec = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
        }
        super.onMeasure(widthMeasSpec, heightSpec);
    }

}
