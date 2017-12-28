package com.example.sebi.androidappreactive.views;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.views.expenses.ExpenseMenuActivity;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

public class MenuActivity extends AppCompatActivity {
    private Button mTagMenu;
    private Button mExpenseMenu;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        setTitle("Main menu");

        mTagMenu = findViewById(R.id.tagMenuButton);
        mTagMenu.setOnClickListener(v -> openTagMenu());

        mExpenseMenu = findViewById(R.id.expenseMenuButton);
        mExpenseMenu.setOnClickListener(v -> openExpenseMenu());

        animateMenu();
    }

    private void animateMenu(){
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.menu_animation);
        mExpenseMenu.startAnimation(animation);
        mTagMenu.startAnimation(animation);
    }

    private void openTagMenu(){
        startActivity(new Intent(this, TagListActivity.class));
    }

    private void openExpenseMenu() {startActivity(new Intent(this, ExpenseMenuActivity.class));}
}
