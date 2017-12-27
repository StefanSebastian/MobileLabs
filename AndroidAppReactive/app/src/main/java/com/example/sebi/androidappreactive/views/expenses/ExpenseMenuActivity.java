package com.example.sebi.androidappreactive.views.expenses;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

public class ExpenseMenuActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_menu);

        Button addExpenseButton = findViewById(R.id.expenseAddButton);
        Button listExpensesButton = findViewById(R.id.expenseListButton);
        Button chartExpensesButton = findViewById(R.id.expenseChartButton);

        addExpenseButton.setOnClickListener(v -> openAddExpenseView());
        listExpensesButton.setOnClickListener(v -> openListExpensesView());
        chartExpensesButton.setOnClickListener(v -> openChartExpensesView());
    }

    private void openAddExpenseView(){
        startActivity(new Intent(this, AddExpenseActivity.class));
    }

    private void openListExpensesView(){
        startActivity(new Intent(this, ListExpenseActivity.class));
    }

    private void openChartExpensesView(){

    }

}
