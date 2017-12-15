package com.example.sebi.androidappreactive;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.auth.UserResourceClient;
import com.jakewharton.retrofit2.adapter.rxjava2.HttpException;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;
import io.realm.RealmResults;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = LoginActivity.class.getSimpleName();
    private Realm mRealm;
    private UserResourceClient mUserResourceClient;
    private Disposable mDisposable = new CompositeDisposable();

    private ProgressBar mProgressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mRealm = Realm.getDefaultInstance();

        mUserResourceClient = new UserResourceClient(this);

        Button login = (Button) findViewById(R.id.loginButton);
        login.setOnClickListener(v -> doLogin());

        mProgressBar = (ProgressBar) findViewById(R.id.loginProgress);
        mProgressBar.setVisibility(View.GONE);
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();

        mDisposable.dispose();
    }

    private void doLogin(){
        mProgressBar.setVisibility(View.VISIBLE);

        mRealm.executeTransactionAsync(
                realm -> realm.where(User.class).findAll().deleteAllFromRealm(), // clear saved user
                () -> Log.d(TAG, "Clear saved user"),
                error -> Log.e(TAG, "Error clearing saved user", error));

        String username = ((EditText) findViewById(R.id.usernameField)).getText().toString();
        String password = ((EditText) findViewById(R.id.passwordField)).getText().toString();

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        mDisposable = mUserResourceClient.login$(user)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        token -> {
                            mRealm.executeTransactionAsync(
                                realm -> {
                                    user.setToken(token.getToken());
                                    realm.copyToRealmOrUpdate(user);
                                });
                            mProgressBar.setVisibility(View.GONE);
                            startActivity(new Intent(this, MenuActivity.class));},
                        error -> {
                            String msg = "authentication error";
                            if (error instanceof HttpException){
                                HttpException e = (HttpException) error;
                                msg = e.response().errorBody().string();
                            }
                            Log.e(TAG, "error authenticating", error);
                            Toast toast = Toast.makeText(this, msg, Toast.LENGTH_SHORT);
                            toast.show();}
                    );
    }
}
