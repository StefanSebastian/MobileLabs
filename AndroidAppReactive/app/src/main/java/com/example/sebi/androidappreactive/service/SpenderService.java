package com.example.sebi.androidappreactive.service;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.expenses.ExpenseDto;
import com.example.sebi.androidappreactive.net.expenses.ExpenseEvent;
import com.example.sebi.androidappreactive.net.expenses.ExpenseResourceClient;
import com.example.sebi.androidappreactive.net.tags.TagDto;
import com.example.sebi.androidappreactive.net.tags.TagEvent;
import com.example.sebi.androidappreactive.net.tags.TagResourceClient;

import io.reactivex.Observable;
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
    private ExpenseResourceClient mExpenseResourceClient;

    /*
    Used to bind to activities
     */
    private ServiceBinder mBinder = new ServiceBinder();

    /*
    Used to capture updates from websocket ; and disposed when the service is destroyed
     */
    private CompositeDisposable mCompositeDisposable = new CompositeDisposable();

    /*
    String containing user authorization token
     */
    private String mAuthorization;

    /*
    Handles local storage
     */
    private Realm mRealm;

    @Override
    public void onCreate() {
        Log.d(TAG, "onCreate");
        super.onCreate();

        mRealm = Realm.getDefaultInstance(); // local storage
        User user = mRealm.where(User.class).findFirst();

        mTagResourceClient = new TagResourceClient(this); // network communication
        mExpenseResourceClient = new ExpenseResourceClient(this);

        mAuthorization = "Bearer " + user.getToken();
        synchronizeLocalStorage("Bearer " + user.getToken());
        listenUpdates(user.getUsername());
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
    private void listenUpdates(String username){
        mCompositeDisposable.add(mTagResourceClient.tagSocket$(username)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(tagEvent -> mRealm.executeTransactionAsync(
                      realm -> updateOrDelete(realm, tagEvent),
                        () -> Log.d(TAG, "update tag"),
                        error -> Log.e(TAG, "failed to persist tag", error)
                )));
        mCompositeDisposable.add(mExpenseResourceClient.expenseSocket$(username)
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(expenseEvent -> mRealm.executeTransactionAsync(
                realm -> updateOrDelete(realm, expenseEvent),
                () -> Log.d(TAG, "update expense"),
                error -> Log.e(TAG, "failed to persist expense", error)
            ))
        );
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

    private void updateOrDelete(Realm realm, ExpenseEvent expenseEvent){
        if (expenseEvent.type == ExpenseEvent.Type.DELETED){
            realm.where(Expense.class).equalTo("id", expenseEvent.expenseDto.getmId()).findAll().deleteAllFromRealm();
        } else {
            realm.copyToRealmOrUpdate(expenseEvent.expenseDto.toExpense());
        }
    }

    /*
    Adds a tag and returns a stream with the result
     */
    public Observable<TagDto> addTag(Tag tag){
        TagDto tagDto = new TagDto();
        tagDto.setmName(tag.getName());
        return mTagResourceClient.add$(mAuthorization, tagDto);
    }

    public Observable<ExpenseDto> addExpense(Expense expense){
        ExpenseDto expenseDto = new ExpenseDto();
        expenseDto.setmAmount(expense.getAmount());
        expenseDto.setmTagName(expense.getTagName());
        expenseDto.setmTimestamp(expense.getTimestamp());
        expenseDto.setmInfo(expense.getInfo());
        expenseDto.setmId(expense.getId());
        return mExpenseResourceClient.add$(mAuthorization, expenseDto);
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        super.onDestroy();

        mCompositeDisposable.dispose();
        mTagResourceClient.shutdown();
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
