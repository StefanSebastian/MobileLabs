package com.example.sebi.androidappreactive.views.expenses;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;
import com.example.sebi.androidappreactive.utils.Utils;

import org.eazegraph.lib.charts.PieChart;
import org.eazegraph.lib.models.PieModel;

import java.util.HashMap;
import java.util.Map;

import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

/**
 * Created by Sebi on 27-Dec-17.
 */

public class ExpenseChartActivity extends AppCompatActivity implements ServiceConnection {
    public static final String TAG = ExpenseChartActivity.class.getSimpleName();

    // local persistence
    private Realm mRealm;
    private RealmResults<Expense> mExpenses;
    private RealmChangeListener mRealmChangeListener = realm -> updateUi();

    // chart
    private PieChart mPieChart;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_chart);

        setTitle("Expense chart");

        mRealm = Realm.getDefaultInstance();
        mExpenses = mRealm.where(Expense.class).findAll();

        // init chart
        mPieChart = findViewById(R.id.expenseChart);

        updateUi();

    }

    @Override
    protected void onStart(){
        super.onStart();
        bindService(new Intent(this, SpenderService.class), this, BIND_AUTO_CREATE);
        mRealm.addChangeListener(mRealmChangeListener);
    }

    private void updateUi(){
        mPieChart.clearChart();

        // collect data
        Map<String, Double> amountPerCategory = new HashMap<>();
        for (Expense expense : mExpenses){
            if (amountPerCategory.containsKey(expense.getTagId())){
                Double current = amountPerCategory.get(expense.getTagId());
                amountPerCategory.put(expense.getTagId(), current + expense.getAmount());
            } else {
                amountPerCategory.put(expense.getTagId(), expense.getAmount());
            }
        }

        for (String key : amountPerCategory.keySet()){
            Double value = amountPerCategory.get(key);

            Tag tag = mRealm.where(Tag.class).equalTo("id", key).findFirst();

            float valueFl = (float)((double)value);
            mPieChart.addPieSlice(new PieModel(tag.getName(), valueFl, Utils.getRandomColor()));
        }

        mPieChart.startAnimation();
    }




    // service connection
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {

    }

    @Override
    public void onServiceDisconnected(ComponentName name) {

    }
}
