package com.example.sebi.retrofitpractice.net;

import android.content.Context;
import android.util.Log;

import com.example.sebi.retrofitpractice.R;
import com.example.sebi.retrofitpractice.model.Tag;
import com.jakewharton.retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;

import java.util.List;

import io.reactivex.Observable;
import io.reactivex.Single;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Sebi on 08-Dec-17.
 */

/*
Responsible with api calls for tags
 */
public class TagResourceClient {
    private static final String TAG = TagResourceClient.class.getSimpleName();

    private final Context mContext;

    private TagResource mTagResource;

    public TagResourceClient(Context context){
        mContext = context;
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(context.getString(R.string.tag_url))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        mTagResource = retrofit.create(TagResource.class);
    }

    public Single<List<Tag>> find$(){
        Log.d(TAG, "find$");
        return mTagResource.find$()
                .flatMap(dtos -> Observable.fromArray(dtos.toArray(new TagDto[dtos.size()])))
                .map(TagDto::toTag)
                .toList();
    }
}
