package com.example.sebi.androidappreactive;

import android.support.annotation.MainThread;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.UserResourceClient;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = LoginActivity.class.getSimpleName();
    private Realm mRealm;
    private UserResourceClient mUserResourceClient;
    private Disposable mDisposable = new CompositeDisposable();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mRealm = Realm.getDefaultInstance();
        mUserResourceClient = new UserResourceClient(this);

        Button login = (Button) findViewById(R.id.loginButton);
        login.setOnClickListener(v -> doLogin());
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();

        mDisposable.dispose();
    }

    private void doLogin(){
        String username = ((EditText) findViewById(R.id.usernameField)).getText().toString();
        String password = ((EditText) findViewById(R.id.passwordField)).getText().toString();

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        mDisposable = mUserResourceClient.login$(user)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(token -> Log.d(TAG, token.toString()));
    }
}
