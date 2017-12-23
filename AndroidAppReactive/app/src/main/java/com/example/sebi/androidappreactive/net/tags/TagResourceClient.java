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

    /*
    Stream of events from the server
     */
    public Observable<TagEvent> tagSocket$(String username){
        mUsername = username;
        /*
        Observable with custom subscribe event
         */
        return Observable.create(new ObservableOnSubscribe<TagEvent>() {
            private ObservableEmitter<TagEvent> mObservableEmitter;

            /*
            On subscribe open socket io connection
            and set event handler
             */
            @Override
            public void subscribe(ObservableEmitter<TagEvent> e) throws Exception {
                Log.d(TAG, "subscribe");
                mObservableEmitter = e;
                try {
                    mSocket = IO.socket(mContext.getString(R.string.server_url));
                    mSocket.on(Socket.EVENT_CONNECT, (args) -> Log.d(TAG, "Socket connected"));
                    mSocket.on(Socket.EVENT_DISCONNECT, (args) -> Log.d(TAG, "Socket disconnected"));
                    mSocket.on("tag/created", (args) -> onNext(TagEvent.Type.CREATED, args));
                    mSocket.on("tag/updated", (args) -> onNext(TagEvent.Type.UPDATED, args));
                    mSocket.on("tag/deleted", (args) -> onNext(TagEvent.Type.DELETED, args));
                    mSocket.connect();
                    mSocket.emit("userIdentification", username);
                } catch (Exception ex) {
                    Log.e(TAG, "Socket error", ex);
                }
            }

            /*
            Parse json object and let the emitter handle onNext
             */
            private void onNext(TagEvent.Type eventType, Object[] args) {
                if (mObservableEmitter != null) {
                    if (mObservableEmitter.isDisposed()) {
                        mSocket.emit("userDisconnect", username);
                        mSocket.disconnect();
                    } else {
                        mObservableEmitter.onNext(new TagEvent(eventType, readTag(args)));
                    }
                }
            }
        });
    }

    private TagDto readTag(Object[] args) {
        try {
            JSONObject obj = (JSONObject) args[0];
            TagDto tagDto = new TagDto();
            tagDto.setmId(obj.getString("_id"));
            tagDto.setmName(obj.getString("name"));
            Log.d(TAG, String.format("readTag %s", obj.toString()));
            return tagDto;
        } catch (JSONException e) {
            Log.d(TAG, "read tag", e);
            return null;
        }
    }

    public void shutdown() {
        Log.d(TAG, "shutdown");
        if (mSocket != null) {
            mSocket.emit("userDisconnect", mUsername);
            mSocket.disconnect();
        }
    }
}
