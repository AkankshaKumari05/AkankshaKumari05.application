package com.example.myapplication.common;

import java.text.DecimalFormat;

public class StringFormatter {

    private static final DecimalFormat priceFormatter = new DecimalFormat("#0.00;-#0.00");

    private static final DecimalFormat priceWithDollarFormatter = new DecimalFormat("'$'#0.00;-'$'#0.00");

    public static String getQuantity(Integer value, int decimals) {
        if (value == null) {
            value = 0;
        }
        DecimalFormat quantityFormatter = getQuantityFormated(decimals);
        return quantityFormatter.format(value);
    }

    private static DecimalFormat getQuantityFormated(int decimals) {
        StringBuilder format = new StringBuilder("#,##0");
        if (decimals > 0) {
            format.append(".");
            while (decimals > 0) {
                format.append("0");
                decimals--;
            }
        }
        return new DecimalFormat(format.toString());
    }
    public static String getPrice(Double value) {
        if (value == null) {
            value = 0.0;
        }
        return priceFormatter.format(value);
    }

    public static String getPriceWithDollar(Double value) {
        if (value == null) {
            value = 0.0;
        }
        return priceWithDollarFormatter.format(value);
    }


}