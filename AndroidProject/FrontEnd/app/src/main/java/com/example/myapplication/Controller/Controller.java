package com.example.myapplication.Controller;

import android.content.Context;
import android.util.Log;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.myapplication.common.ReqURLBuilder;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

public class Controller {
    private static final String TAG = Controller.class.getName();

    private static boolean initialized;
    private static RequestQueue requestQueue;

    private static final String SEARCH_AUTOCOMPLETE_TAG = "SEARCH_AUTOCOMPLETE_TAG";
    private static final String LASTEST_PRICES_REQUEST_TAG = "LASTEST_PRICES_REQUEST_TAG";
    private static final String DETAIL_FETCH_REQUEST_TAG = "DETAIL_FETCH_REQUEST_TAG";

    synchronized public static void initialize(Context context) {
        if (!initialized) {
            initialized = true;
            requestQueue = Volley.newRequestQueue(context.getApplicationContext());
        }
    }

    public static void fetchAutocompleteSearch(String query, Response.Listener<JSONObject> listener,
                                                     Response.ErrorListener errorListener) {
        Log.d(TAG, "Fetching search options");
        String url = (new ReqURLBuilder())
                .path("search/autocomplete/"+query)
                .build();
        JsonObjectRequest request = fetchRequest(url, listener, errorListener, SEARCH_AUTOCOMPLETE_TAG);
        addRequestToQueue(request);
    }

    public static void fetchDetails(String ticker, Response.Listener<JSONObject> listener,
                                    Response.ErrorListener errorListener) {
        Log.d(TAG, "Fetching detail");
        String url = (new ReqURLBuilder())
                .path("tickerDetails/"+ticker)
                .build();
        JsonObjectRequest request = fetchRequest(url, listener, errorListener, DETAIL_FETCH_REQUEST_TAG);
        addRetryPolicyToRequest(request, 30);
        addRequestToQueue(request);
    }

    public static void makeLastPricesFetchRequest(List<String> tickers, Response.Listener<JSONObject> listener,
                                                  Response.ErrorListener errorListener) {
        Log.d(TAG, "Fetching last prices");
        String ticker="";
        for(String tic: tickers){
            ticker=ticker.concat(tic);
            ticker=ticker.concat("_");
        }
        String url = (new ReqURLBuilder())
                .path("latestStockPrice/"+ticker)
                .build();
        JsonObjectRequest request = fetchRequest(url, listener, errorListener, LASTEST_PRICES_REQUEST_TAG);
        addRequestToQueue(request);
    }


    private static JsonArrayRequest fetchARequest(String url, Response.Listener<JSONArray> listener,
                                                 Response.ErrorListener errorListener, String tag) {
        Log.d(TAG, url);
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null, listener, errorListener);
        request.setTag(tag);
        return request;
    }
    private static JsonObjectRequest fetchRequest(String url, Response.Listener<JSONObject> listener,
                                                 Response.ErrorListener errorListener, String tag) {
        Log.d(TAG, url);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, listener, errorListener);
        request.setTag(tag);
        return request;
    }

    private static void addRetryPolicyToRequest(JsonObjectRequest request, int retryTimeoutSeconds) {
        RetryPolicy retryPolicy = new DefaultRetryPolicy(
                retryTimeoutSeconds * 1000, DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
        request.setRetryPolicy(retryPolicy);
    }

    synchronized private static void addRequestToQueue(JsonObjectRequest request) {
        requestQueue.add(request);
    }
    synchronized private static void addORequestToQueue(JsonArrayRequest request) {
        requestQueue.add(request);
    }

    synchronized public static void cancelLastPricesFetchRequest() {
        requestQueue.cancelAll(LASTEST_PRICES_REQUEST_TAG);
    }

    synchronized public static void cancelSearchOptionsFetchRequest() {
        requestQueue.cancelAll(SEARCH_AUTOCOMPLETE_TAG);
    }

    synchronized public static void cancelDetailFetchRequest() {
        requestQueue.cancelAll(DETAIL_FETCH_REQUEST_TAG);
    }

    public static boolean isNotFoundError(VolleyError error) {
        return error.networkResponse != null && error.networkResponse.statusCode == 404;
    }
}