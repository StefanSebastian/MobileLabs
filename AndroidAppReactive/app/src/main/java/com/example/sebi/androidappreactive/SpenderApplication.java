package com.example.sebi.androidappreactive;

import android.app.Application;

import io.realm.Realm;

/**
 * Created by Sebi on 11-Dec-17.
 */

public class SpenderApplication extends Application {
    @Override
    public void onCreate(){
        super.onCreate();
        Realm.init(this);
    }
}
