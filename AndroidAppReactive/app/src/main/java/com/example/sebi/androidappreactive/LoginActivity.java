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

    /*
    Local storage
    used to save user and token
     */
    private Realm mRealm;

    /*
    Network communication
    Used for login requests
     */
    private UserResourceClient mUserResourceClient;

    /*
    Saves a stream of the login response, disposes it if the app is closed
     */
    private CompositeDisposable mDisposable = new CompositeDisposable();

    /*
    Indicate login progress
     */
    private ProgressBar mProgressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "onCreate");

        setContentView(R.layout.activity_login);

        mRealm = Realm.getDefaultInstance();

        mUserResourceClient = new UserResourceClient(this);

        Button login = (Button) findViewById(R.id.loginButton);
        login.setOnClickListener(v -> doLogin());

        mProgressBar = (ProgressBar) findViewById(R.id.loginProgress);
        mProgressBar.setVisibility(View.GONE);

        Button signup = (Button) findViewById(R.id.signupButton);
        signup.setOnClickListener(v -> doSignup());
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        Log.d(TAG, "onCreate");

        mDisposable.dispose();
    }

    @Override
    protected void onStart(){
        super.onStart();
        Log.d(TAG, "onStart");
    }

    @Override
    protected void onPause(){
        super.onPause();
        Log.d(TAG, "onPause");
    }

    @Override
    protected void onResume(){
        super.onResume();
        Log.d(TAG, "onResume");
    }

    @Override
    protected void onStop(){
        super.onStop();
        Log.d(TAG, "onStop");
    }

    private void doLogin(){
        mProgressBar.setVisibility(View.VISIBLE);

        //clear saved user
        mRealm.executeTransactionAsync(
                realm -> realm.where(User.class).findAll().deleteAllFromRealm(),
                () -> Log.d(TAG, "Clear saved user"),
                error -> Log.e(TAG, "Error clearing saved user", error));

        //get login data
        String username = ((EditText) findViewById(R.id.usernameField)).getText().toString();
        String password = ((EditText) findViewById(R.id.passwordField)).getText().toString();
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        mDisposable.add(mUserResourceClient.login$(user)
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
                            toast.show();
                            mProgressBar.setVisibility(View.GONE);
                            }
                    ));
    }

    private void doSignup(){
        mProgressBar.setVisibility(View.VISIBLE);

        //get login data
        String username = ((EditText) findViewById(R.id.usernameField)).getText().toString();
        String password = ((EditText) findViewById(R.id.passwordField)).getText().toString();
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        mDisposable.add(mUserResourceClient.signup$(user)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        token -> {
                            mProgressBar.setVisibility(View.GONE);
                            Toast.makeText(this, "Succesful signup", Toast.LENGTH_SHORT).show();
                            },
                        error -> {
                            String msg = "signup error";
                            if (error instanceof HttpException){
                                HttpException e = (HttpException) error;
                                msg = e.response().errorBody().string();
                            }
                            Log.e(TAG, "error signing up", error);
                            Toast toast = Toast.makeText(this, msg, Toast.LENGTH_SHORT);
                            toast.show();
                            mProgressBar.setVisibility(View.GONE);
                            }
                ));
    }
}
