package com.example.myapplication.common;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.example.myapplication.Section.DailyChartFragment;
import com.example.myapplication.Section.HistChartFragment;

public class ChartAdapter extends FragmentStateAdapter {

    public ChartAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    public ChartAdapter(@NonNull Fragment fragment) {
        super(fragment);
    }

    public ChartAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new DailyChartFragment();
            default:
                return new HistChartFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 2;
    }
}