package com.example.sebi.androidapp.net;

import android.app.DownloadManager;
import android.content.Context;
import android.util.JsonReader;
import android.util.Log;

import com.example.sebi.androidapp.R;
import com.example.sebi.androidapp.content.Tag;
import com.example.sebi.androidapp.util.OkCancellableCall;
import com.example.sebi.androidapp.util.OnErrorListener;
import com.example.sebi.androidapp.util.OnSuccessListener;
import com.example.sebi.androidapp.util.ResourceListReader;

import java.io.IOError;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class TagRestClient {
    public static final String TAG = TagRestClient.class.getSimpleName();

    private final OkHttpClient mOkHttpClient;
    private final String mApiUrl;
    private final String mTagUrl;

    public TagRestClient(Context context){
        mOkHttpClient = new OkHttpClient();
        mApiUrl = context.getString(R.string.api_url);
        mTagUrl = mApiUrl.concat("/tag");
        Log.d(TAG, "Tag rest client created");
    }

    public OkCancellableCall getAllAsync(
            final OnSuccessListener<List<Tag>> onSuccessListener,
            final OnErrorListener onErrorListener){
        Request request = new Request.Builder().url(mTagUrl).build();
        Log.d(TAG, "Request at " + mTagUrl);
        Call call = null;
        try {
            call = mOkHttpClient.newCall(request);
            Log.d(TAG, "getAllTags async queued");
            call.enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.e(TAG, "getAllTags async failed", e);
                    onErrorListener.onError(e);
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    Log.d(TAG, "getAllTags async completed");
                    JsonReader reader = new JsonReader(new InputStreamReader(response.body().byteStream(), "UTF-8"));
                    onSuccessListener.onSuccess(new TagListReader().read(reader));
                }
            });
        } catch (Exception e){
            Log.e(TAG, "getAllTags async failed", e);
            onErrorListener.onError(e);
        } finally {
            return new OkCancellableCall(call);
        }
    }

}
