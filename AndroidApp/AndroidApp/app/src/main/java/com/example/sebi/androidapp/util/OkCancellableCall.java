package com.example.sebi.androidapp.util;

/**
 * Created by Sebi on 18-Nov-17.
 */

import android.util.Log;

import okhttp3.Call;

public class OkCancellableCall {
    public static final String TAG = OkCancellableCall.class.getSimpleName();

    private final Call mCall;

    public OkCancellableCall(Call call){
        mCall = call;
    }

    public void cancel(){
        if (mCall != null && !mCall.isCanceled()){
            Log.d(TAG, "Cancelling the call");
            mCall.cancel();
        }
    }
}
