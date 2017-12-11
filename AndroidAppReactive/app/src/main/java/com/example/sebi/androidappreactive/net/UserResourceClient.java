package com.example.sebi.androidappreactive.net;

import android.content.Context;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.User;
import com.jakewharton.retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;

import java.util.concurrent.Callable;

import io.reactivex.Observable;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Sebi on 11-Dec-17.
 */

public class UserResourceClient {
    private static final String TAG = UserResourceClient.class.getSimpleName();

    private UserResource mUserResource;

    private Context mContext;

    public UserResourceClient(Context context){
        mContext = context;
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(context.getString(R.string.server_url))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        mUserResource = retrofit.create(UserResource.class);
    }

    public Observable<TokenDto> login$(User user){
        return mUserResource.login$(user);
    }
}
