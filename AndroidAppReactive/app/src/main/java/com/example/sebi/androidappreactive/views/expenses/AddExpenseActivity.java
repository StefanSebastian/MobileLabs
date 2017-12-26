package com.example.sebi.androidappreactive.views.expenses;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.utils.Utils;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

import java.text.SimpleDateFormat;
import java.util.Date;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

import static android.view.View.GONE;

/**
 * Created by Sebi on 26-Dec-17.
 */

public class AddExpenseActivity extends AppCompatActivity implements ServiceConnection {
    private static final String TAG = AddExpenseActivity.class.getSimpleName();

    // local storage
    private Realm mRealm;
    private RealmChangeListener mRealmChangeListener = realm -> updateUi();
    private RealmResults<Tag> mTags;

    // add view
    private ProgressBar mAddLoadingView;
    private Button mAddExpenseButton;
    private Spinner mTagDropdown;
    private EditText mInfoField;
    private EditText mAmountField;

    // service
    private SpenderService mSpenderService;

    // disposing of network calls
    private CompositeDisposable mDisposable = new CompositeDisposable();

    /*
    sets tag options
     */
    private void updateUi() {
        if (mTags.size() == 0){
            Popups.displayNotification("You must insert some tags first", this);
            startActivity(new Intent(this, ExpenseMenuActivity.class));
        }

        String[] tags = new String[mTags.size()];
        int i = 0;
        for (Tag tag : mTags){
            tags[i] = tag.getName();
            i++;
        }

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, tags);

        mTagDropdown.setAdapter(adapter);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_add);

        // get realm and the initial values for the tags
        mRealm = Realm.getDefaultInstance();
        mTags = mRealm.where(Tag.class).findAll();

        mTagDropdown = findViewById(R.id.expenseAddTagNameField);
        mAddLoadingView = findViewById(R.id.expenseAddProgress);
        mInfoField = findViewById(R.id.expenseAddInfoField);
        mAmountField = findViewById(R.id.expenseAddAmountField);
        mAddExpenseButton = findViewById(R.id.expenseAddButton);

        setLoadingView(false);
        mAddExpenseButton.setOnClickListener(v -> addExpense());

        setTitle("Add expense");

        // update UI
        updateUi();
    }

    private void setLoadingView(Boolean loading){
        if (loading){
            mAddLoadingView.setVisibility(View.VISIBLE);
            mTagDropdown.setVisibility(View.GONE);
            mInfoField.setVisibility(View.GONE);
            mAmountField.setVisibility(View.GONE);
            mAddExpenseButton.setVisibility(View.GONE);
        } else {
            mAddLoadingView.setVisibility(View.GONE);
            mTagDropdown.setVisibility(View.VISIBLE);
            mInfoField.setVisibility(View.VISIBLE);
            mAmountField.setVisibility(View.VISIBLE);
            mAddExpenseButton.setVisibility(View.VISIBLE);
        }
    }

    private void addExpense(){
        setLoadingView(true);

        String info = mInfoField.getText().toString();
        String amount = mAmountField.getText().toString();
        String tagName = mTagDropdown.getSelectedItem().toString();

        Log.d(TAG, "Adding " + info + " " + amount + " " + tagName);

        if (mSpenderService == null){
            Popups.displayError("Service not connected", this);
        } else {
            Expense expense = new Expense();
            expense.setTimestamp(new Date());
            expense.setInfo(info);
            expense.setAmount(Double.parseDouble(amount));
            expense.setTagName(tagName);

            mDisposable.add(
                    mSpenderService.addExpense(expense)
                            .subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(
                                    expenseDto -> {
                                        Popups.displayNotification("Successful add", this);
                                    },
                                    error -> {
                                        Popups.displayError(error.getMessage(), this);
                                    }
                            )
            );

        }

        setLoadingView(false);
    }

    @Override
    protected void onStart() {
        super.onStart();
        bindService(new Intent(this, SpenderService.class), this, BIND_AUTO_CREATE);

        mRealm.addChangeListener(mRealmChangeListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        unbindService(this);
        mRealm.removeAllChangeListeners();
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        mRealm.close();
        mDisposable.dispose();
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder binder) {
        mSpenderService = ((SpenderService.ServiceBinder) binder).getService();
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        mSpenderService = null;
    }
}
