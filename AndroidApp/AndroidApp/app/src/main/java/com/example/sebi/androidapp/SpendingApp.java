package com.example.sebi.androidapp;

import android.app.Application;
import android.util.Log;

import com.example.sebi.androidapp.net.TagRestClient;
import com.example.sebi.androidapp.service.TagManager;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class SpendingApp extends Application {
    public static final String TAG = SpendingApp.class.getSimpleName();

    private TagManager mTagManager;
    private TagRestClient mTagRestClient;

    @Override
    public void onCreate(){
        super.onCreate();
        Log.d(TAG, "onCreate");
        mTagManager = new TagManager(this);
        mTagRestClient = new TagRestClient(this);
        mTagManager.setmTagRestClient(mTagRestClient);
    }

    public TagManager getTagManager(){
        return mTagManager;
    }

    @Override
    public void onTerminate(){
        super.onTerminate();
        Log.d(TAG, "onTerminate");
    }
}
