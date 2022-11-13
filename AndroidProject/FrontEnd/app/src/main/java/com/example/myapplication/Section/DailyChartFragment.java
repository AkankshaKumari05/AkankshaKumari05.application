package com.example.myapplication.Section;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.example.myapplication.R;

public class DailyChartFragment extends Fragment {

    public DailyChartFragment() {
        // Required empty public constructor
    }

    public static DailyChartFragment newInstance() {
        DailyChartFragment fragment = new DailyChartFragment();
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View root= inflater.inflate(R.layout.daily_chart, container, false);
        return root;
    }
}