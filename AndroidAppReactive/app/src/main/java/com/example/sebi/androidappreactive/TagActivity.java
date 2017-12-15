package com.example.sebi.androidappreactive;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;
import com.example.sebi.androidappreactive.utils.Utils;

import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

public class TagActivity extends AppCompatActivity implements ServiceConnection {
    private static final String TAG = TagActivity.class.getSimpleName();

    private SpenderService mSpenderService;
    private Realm mRealm;

    // temporary
    private RealmChangeListener mRealmRealmChangeListener = realm -> updateUi();
    private RealmResults<Tag> mTags;
    private TextView mText;

    private void updateUi() {
        mText.setText(Utils.listToString(mTags));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mRealm = Realm.getDefaultInstance();

        mText = (TextView) findViewById(R.id.text);
        mTags = mRealm.where(Tag.class).findAll();
        updateUi();
    }

    @Override
    protected void onStart() {
        super.onStart();
        bindService(new Intent(this, SpenderService.class), this, BIND_AUTO_CREATE);

        mRealm.addChangeListener(mRealmRealmChangeListener);
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
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder binder) {
        Log.d(TAG, "onServiceConnected");
        mSpenderService = ((SpenderService.ServiceBinder) binder).getService();
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        Log.d(TAG, "onServiceDisconnected");
        mSpenderService = null;
    }
}
