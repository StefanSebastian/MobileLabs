package com.example.sebi.androidappreactive.views.expenses;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.expenses.ExpenseResourceClient;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.utils.Utils;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;

/**
 * Created by Sebi on 27-Dec-17.
 */

public class ExpenseDetailActivity extends AppCompatActivity {
    public static final String TAG = ExpenseDetailActivity.class.getSimpleName();

    public static final String EXPENSE_ID = "EXPENSE_ID";

    // local storage
    private Realm mRealm;

    // views
    private TextView mInfo;
    private TextView mAmount;
    private TextView mTagName;
    private TextView mTimestamp;

    private Button mDeleteExpense;

    private ProgressBar mDeleteProgress;

    // expense to display
    private Expense mExpense;

    // network connection
    private ExpenseResourceClient mExpenseResourceClient;
    private CompositeDisposable mDisposable;
    private String mAuthorization;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_detail);

        setTitle("Expense detail");

        // persistence
        mRealm = Realm.getDefaultInstance();

        // get logged in user
        User user = mRealm.where(User.class).findFirst();
        mAuthorization = "Bearer " + user.getToken();

        // network
        mExpenseResourceClient = new ExpenseResourceClient(this);
        mDisposable = new CompositeDisposable();

        // view
        mInfo = findViewById(R.id.expenseInfoDetail);
        mAmount = findViewById(R.id.expenseAmountDetail);
        mTimestamp = findViewById(R.id.expenseTimestampDetail);
        mTagName = findViewById(R.id.expenseTagNameDetail);
        mDeleteProgress = findViewById(R.id.expenseDeleteProgress);

        mDeleteExpense = findViewById(R.id.expenseDeleteButton);
        mDeleteExpense.setOnClickListener(v -> deleteExpense());

        showLoading(false);

        // retrieve expense to display
        String expenseId = getIntent().getStringExtra(ExpenseDetailActivity.EXPENSE_ID);
        if (expenseId == null){
            Popups.displayError("Invalid expense", this);
            startActivity(new Intent(this, ExpenseMenuActivity.class));
        } else {
            Log.d(TAG, "Detail view for " + expenseId);

            Expense expense = mRealm.where(Expense.class).equalTo("id", expenseId).findFirst();
            mExpense = expense;

            Tag tag = mRealm.where(Tag.class).equalTo("id", expense.getTagId()).findFirst();

            mInfo.setText(expense.getInfo());
            mAmount.setText("Amount: " + expense.getAmount().toString());
            mTimestamp.setText(Utils.getDefaultDateFormat().format(expense.getTimestamp()));
            mTagName.setText("Category: " + tag.getName());
        }


    }

    // toggle menu visibility
    private void showLoading(Boolean loading){
        if (loading){
            mDeleteProgress.setVisibility(View.VISIBLE);
            mInfo.setVisibility(View.GONE);
            mAmount.setVisibility(View.GONE);
            mTimestamp.setVisibility(View.GONE);
            mTagName.setVisibility(View.GONE);
            mDeleteExpense.setVisibility(View.GONE);
        } else {
            mDeleteProgress.setVisibility(View.GONE);
            mInfo.setVisibility(View.VISIBLE);
            mAmount.setVisibility(View.VISIBLE);
            mTimestamp.setVisibility(View.VISIBLE);
            mTagName.setVisibility(View.VISIBLE);
            mDeleteExpense.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        Log.d(TAG, "onDestroy");

        mDisposable.dispose();
    }


    /*
    Deletes the selected expense
     */
    private void deleteExpense(){
        Log.d(TAG, "deleting " + mExpense.getId());

        showLoading(true);
        mDisposable.add(mExpenseResourceClient.delete$(mAuthorization, mExpense.getId())
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        expenseDto -> {
                            Popups.displayNotification("Success", this);
                            startActivity(new Intent(this, ListExpenseActivity.class));
                            showLoading(false);
                        },
                        error -> {
                            String msg = error.getMessage();
                            String parsed = Utils.getErrorMessageFromHttp(error);
                            msg = parsed == null ? msg : parsed;
                            Log.e(TAG, "error adding expense", error);

                            Popups.displayError(msg, this);
                            showLoading(false);
                        }
                )
        );
    }
}
