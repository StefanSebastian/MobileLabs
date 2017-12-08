package com.example.sebi.androidappreactive.service;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.example.sebi.androidappreactive.net.TagResourceClient;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

/**
 * Created by Sebi on 08-Dec-17.
 */

public class SpenderService extends Service {
    private static final String TAG = SpenderService.class.getSimpleName();

    /*
    REST client
     */
    private TagResourceClient mTagResourceClient;

    /*
    Used to bind to activities
     */
    private ServiceBinder mBinder = new ServiceBinder();

    private CompositeDisposable mCompositeDisposable = new CompositeDisposable();

    @Override
    public void onCreate() {
        Log.d(TAG, "onCreate");
        super.onCreate();
        mTagResourceClient = new TagResourceClient(this);

        mTagResourceClient.find$()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(tags -> Log.d(TAG, tags.toString()),
                        error -> Log.e(TAG, "Failed to fetch tags " + error));

        listenUpdates();
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        super.onDestroy();

        mCompositeDisposable.dispose();
    }

    private void listenUpdates(){
        mCompositeDisposable.add(mTagResourceClient.tagSocket$()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(tagEvent -> Log.d(TAG, tagEvent.toString()))
                );
    }


    public class ServiceBinder extends Binder {
        public SpenderService getService() {
            return SpenderService.this;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

}
