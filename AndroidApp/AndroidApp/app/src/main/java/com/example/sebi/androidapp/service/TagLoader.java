package com.example.sebi.androidapp.service;

import android.content.Context;
import android.util.Log;

import com.example.sebi.androidapp.content.Tag;
import com.example.sebi.androidapp.net.TagRestClient;
import com.example.sebi.androidapp.util.OkAsyncTaskLoader;

import java.util.List;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class TagLoader extends OkAsyncTaskLoader<List<Tag>> {
    private static final String TAG = TagLoader.class.getSimpleName();
    private final TagRestClient mTagRestClient;
    private List<Tag> tags;

    public TagLoader(Context context, TagRestClient tagRestClient) {
        super(context);
        mTagRestClient = tagRestClient;
    }

    @Override
    public List<Tag> tryLoadInBackground() throws Exception {
        Log.d(TAG, "tryLoadInBackground");
       // tags = mTagRestClient.getAllAsync()
        return null;
    }
}
