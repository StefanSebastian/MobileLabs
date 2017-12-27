package com.example.sebi.androidappreactive.views.expenses;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.expenses.ExpenseResourceClient;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.utils.Utils;
import com.example.sebi.androidappreactive.views.tags.TagDetailFragment;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

import org.w3c.dom.Text;

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

    private Realm mRealm;

    private TextView mInfo;
    private TextView mAmount;
    private TextView mTagName;
    private TextView mTimestamp;

    private Button mDeleteExpense;

    private Expense mExpense;

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

        mDeleteExpense = findViewById(R.id.expenseDeleteButton);
        mDeleteExpense.setOnClickListener(v -> deleteExpense());

        String expenseId = getIntent().getStringExtra(ExpenseDetailActivity.EXPENSE_ID);
        if (expenseId == null){
            Popups.displayError("Invalid expense", this);
            startActivity(new Intent(this, ExpenseMenuActivity.class));
        } else {
            Log.d(TAG, "Detail view for " + expenseId);

            Expense expense = mRealm.where(Expense.class).equalTo("id", expenseId).findFirst();
            mExpense = expense;

            mInfo.setText(expense.getInfo());
            mAmount.setText("Amount: " + expense.getAmount().toString());
            mTimestamp.setText(Utils.getDefaultDateFormat().format(expense.getTimestamp()));
            mTagName.setText("Category: " + expense.getTagName());
        }


    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        Log.d(TAG, "onDestroy");

        mDisposable.dispose();
    }


    private void deleteExpense(){
        Log.d(TAG, "deleting " + mExpense.getId());

        mDisposable.add(mExpenseResourceClient.delete$(mAuthorization, mExpense.getId())
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        expenseDto -> {
                            Popups.displayNotification("Success", this);
                            startActivity(new Intent(this, ListExpenseActivity.class));
                        },
                        error -> {
                            Popups.displayError(error.getMessage(), this);
                        }
                )
        );
    }
}
