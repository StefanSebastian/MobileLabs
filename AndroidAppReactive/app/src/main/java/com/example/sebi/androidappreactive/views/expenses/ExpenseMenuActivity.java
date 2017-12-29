package com.example.sebi.androidappreactive.views.expenses;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

/*
Simple menu activity
 */
public class ExpenseMenuActivity extends AppCompatActivity {

    private Button mAddExpenseButton;
    private Button mListExpensesButton;
    private Button mChartExpensesButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_menu);

        mAddExpenseButton = findViewById(R.id.expenseAddButton);
        mListExpensesButton = findViewById(R.id.expenseListButton);
        mChartExpensesButton = findViewById(R.id.expenseChartButton);

        mAddExpenseButton.setOnClickListener(v -> openAddExpenseView());
        mListExpensesButton.setOnClickListener(v -> openListExpensesView());
        mChartExpensesButton.setOnClickListener(v -> openChartExpensesView());

        animateMenu();
    }

    private void animateMenu(){
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.expense_menu_animation);
        mAddExpenseButton.startAnimation(animation);
        mListExpensesButton.startAnimation(animation);
        mChartExpensesButton.startAnimation(animation);
    }

    private void openAddExpenseView(){
        startActivity(new Intent(this, AddExpenseActivity.class));
    }

    private void openListExpensesView(){
        startActivity(new Intent(this, ListExpenseActivity.class));
    }

    private void openChartExpensesView(){
        startActivity(new Intent(this, ExpenseChartActivity.class));
    }

}
