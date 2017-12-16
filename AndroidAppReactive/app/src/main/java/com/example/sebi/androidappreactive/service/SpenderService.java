package com.example.sebi.androidappreactive.service;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.tags.TagEvent;
import com.example.sebi.androidappreactive.net.tags.TagResourceClient;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;

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

    /*
    Used to capture updates from websocket ; and disposed when the service is destroyed
     */
    private CompositeDisposable mCompositeDisposable = new CompositeDisposable();

    /*
    Handles local storage
     */
    private Realm mRealm;

    @Override
    public void onCreate() {
        Log.d(TAG, "onCreate");
        super.onCreate();
        mTagResourceClient = new TagResourceClient(this); // network communication
        mRealm = Realm.getDefaultInstance(); // local storage

        User user = mRealm.where(User.class).findFirst();

        synchronizeLocalStorage("Bearer " + user.getToken());
        listenUpdates();
    }

    /*
    Gets a stream from resource client ; stream contains a list of tags
    use realm to add response to local storage
     */
    private void synchronizeLocalStorage(String authorization){
        mTagResourceClient.find$(authorization)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        tags -> mRealm.executeTransactionAsync(
                            realm -> {
                                realm.where(Tag.class).findAll().deleteAllFromRealm();
                                realm.copyToRealmOrUpdate(tags);
                            },
                            () -> Log.d(TAG, "updated tags"),
                            error -> Log.e(TAG, "failed to persist tags", error)),
                        error -> Log.e(TAG, "failed to fetch tags", error)
                );
    }

    /*
    Listen updates from websocket stream
    sync objects with realm instance
     */
    private void listenUpdates(){
        mCompositeDisposable.add(mTagResourceClient.tagSocket$()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(tagEvent -> mRealm.executeTransactionAsync(
                      realm -> updateOrDelete(realm, tagEvent),
                        () -> Log.d(TAG, "update tag"),
                        error -> Log.e(TAG, "failed to persist tag", error)
                )));
    }

    /*
    Updates or deletes a tag, based on event
     */
    private void updateOrDelete(Realm realm, TagEvent tagEvent) {
        if (tagEvent.type == TagEvent.Type.DELETED) {
            realm.where(Tag.class).equalTo("id", tagEvent.tagDto.getmId()).findAll().deleteAllFromRealm();
        } else {
            realm.copyToRealmOrUpdate(tagEvent.tagDto.toTag());
        }
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        super.onDestroy();

        mCompositeDisposable.dispose();
        mRealm.close();
    }



    /*
    Used to bind to activities
     */
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
