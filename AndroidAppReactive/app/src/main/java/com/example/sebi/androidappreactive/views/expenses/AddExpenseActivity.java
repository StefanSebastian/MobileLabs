package com.example.sebi.androidappreactive.views.expenses;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v7.app.AppCompatActivity;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Spinner;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

import io.reactivex.disposables.CompositeDisposable;
import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

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
            startActivity(new Intent(this, TagListActivity.class));
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

        setTitle("Add expense");

        // update UI
        updateUi();
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
    public void onServiceConnected(ComponentName name, IBinder service) {

    }

    @Override
    public void onServiceDisconnected(ComponentName name) {

    }
}
