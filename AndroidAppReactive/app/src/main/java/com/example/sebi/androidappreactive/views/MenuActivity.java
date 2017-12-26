package com.example.sebi.androidappreactive.views;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.views.expenses.ExpenseMenuActivity;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

public class MenuActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        setTitle("Main menu");

        Button tagView = findViewById(R.id.tagMenuButton);
        tagView.setOnClickListener(v -> openTagMenu());

        Button expenseMenu = findViewById(R.id.expenseMenuButton);
        expenseMenu.setOnClickListener(v -> openExpenseMenu());
    }

    private void openTagMenu(){
        startActivity(new Intent(this, TagListActivity.class));
    }

    private void openExpenseMenu() {startActivity(new Intent(this, ExpenseMenuActivity.class));}
}
