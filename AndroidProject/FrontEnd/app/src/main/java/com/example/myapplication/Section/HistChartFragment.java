package com.example.myapplication.Section;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.example.myapplication.R;


public class HistChartFragment extends Fragment {


    public HistChartFragment() {
        // Required empty public constructor
    }
    public static HistChartFragment newInstance() {
        HistChartFragment fragment = new HistChartFragment();
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.hist_chart, container, false);
        return root;
    }
}