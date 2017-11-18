package com.example.sebi.androidapp.service;

import android.content.Context;
import android.util.Log;

import com.example.sebi.androidapp.content.Tag;
import com.example.sebi.androidapp.net.TagRestClient;
import com.example.sebi.androidapp.util.OkCancellableCall;
import com.example.sebi.androidapp.util.OnErrorListener;
import com.example.sebi.androidapp.util.OnSuccessListener;

import java.util.List;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class TagManager {
    private static final String TAG = TagManager.class.getSimpleName();

    private List<Tag> mTags;
    private OnTagUpdateListener mOnUpdate;

    private final Context mContext;
    private TagRestClient mTagRestClient;

    public TagManager(Context context){
        mContext = context;
    }

    public TagLoader getTagLoader(){
        Log.d(TAG, "getTagLoader");
        return new TagLoader(mContext, mTagRestClient);
    }

    public void setOnUpdate(OnTagUpdateListener onUpdate){
        mOnUpdate = onUpdate;
    }

    public void setmTagRestClient(TagRestClient tagRestClient){
        mTagRestClient = tagRestClient;
    }

    public OkCancellableCall getTagsAsync(
            OnSuccessListener<List<Tag>> onSuccessListener,
            OnErrorListener onErrorListener){
        return mTagRestClient.getAllAsync(onSuccessListener, onErrorListener);
    }
}
