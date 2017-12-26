package com.example.sebi.androidappreactive.net.tags;

import android.content.Context;
import android.util.Log;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Tag;
import com.jakewharton.retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.Single;
import io.realm.Realm;
import io.socket.client.IO;
import io.socket.client.Socket;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Sebi on 08-Dec-17.
 */

public class TagResourceClient {
    private static final String TAG = TagResourceClient.class.getSimpleName();

    // used to access app resources
    private final Context mContext;

    // REST consumer
    private TagResource mTagResource;

    // used to open / close websocket connections
    private Socket mSocket;
    private String mUsername;

    /*
    Constructor
    initialize retrofit
     */
    public TagResourceClient(Context context){
        mContext = context;
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(context.getString(R.string.server_url))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        mTagResource = retrofit.create(TagResource.class);
    }

    public Observable<TagDto> add$(String authorization, TagDto tagDto){
        Log.d(TAG, "add$");
        return mTagResource.add$(authorization, tagDto);
    }

    public Observable<TagDto> delete$(String authorization, String id){
        Log.d(TAG, "delete$");
        return mTagResource.delete$(authorization, id);
    }

    public Observable<TagDto> update$(String authorization, String id, TagDto tag){
        Log.d(TAG, "update$");
        return mTagResource.update$(authorization, id, tag);
    }

    /*
    A stream that returns a single value = a list ( result of get all )
     */
    public Single<List<Tag>> find$(String authorization){
        Log.d(TAG, "find$");
        return mTagResource.find$(authorization)
                .flatMap(dtos -> Observable.fromArray(dtos.toArray(new TagDto[dtos.size()])))
                .map(TagDto::toTag)
                .toList();
    }

}
