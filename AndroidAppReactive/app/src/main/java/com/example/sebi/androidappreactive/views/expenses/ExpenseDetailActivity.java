package com.example.sebi.androidappreactive.views.expenses;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.utils.Utils;
import com.example.sebi.androidappreactive.views.tags.TagDetailFragment;

import org.w3c.dom.Text;

import io.realm.Realm;

/**
 * Created by Sebi on 27-Dec-17.
 */

public class ExpenseDetailActivity extends AppCompatActivity {
    public static final String TAG = ExpenseDetailActivity.class.getSimpleName();

    public static final String EXPENSE_ID = "EXPENSE_ID";

    private Realm mRealm;

    private TextView mInfo;
    private TextView mAmount;
    private TextView mTagName;
    private TextView mTimestamp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_detail);

        setTitle("Expense detail");

        // persistence
        mRealm = Realm.getDefaultInstance();

        mInfo = findViewById(R.id.expenseInfoDetail);
        mAmount = findViewById(R.id.expenseAmountDetail);
        mTimestamp = findViewById(R.id.expenseTimestampDetail);
        mTagName = findViewById(R.id.expenseTagNameDetail);

        String expenseId = getIntent().getStringExtra(ExpenseDetailActivity.EXPENSE_ID);
        if (expenseId == null){
            Popups.displayError("Invalid expense", this);
            startActivity(new Intent(this, ExpenseMenuActivity.class));
        } else {
            Log.d(TAG, "Detail view for " + expenseId);

            Expense expense = mRealm.where(Expense.class).equalTo("id", expenseId).findFirst();

            mInfo.setText(expense.getInfo());
            mAmount.setText("Amount: " + expense.getAmount().toString());
            mTimestamp.setText(Utils.getDefaultDateFormat().format(expense.getTimestamp()));
            mTagName.setText("Category: " + expense.getTagName());
        }


    }
}
