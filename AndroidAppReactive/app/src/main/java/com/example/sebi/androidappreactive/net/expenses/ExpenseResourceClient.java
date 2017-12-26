package com.example.sebi.androidappreactive.net.expenses;

import android.content.Context;
import android.util.Log;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.net.tags.TagDto;
import com.example.sebi.androidappreactive.net.tags.TagEvent;
import com.example.sebi.androidappreactive.net.tags.TagResource;
import com.example.sebi.androidappreactive.net.tags.TagResourceClient;
import com.jakewharton.retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.socket.client.IO;
import io.socket.client.Socket;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Sebi on 26-Dec-17.
 */

public class ExpenseResourceClient {
    private static final String TAG = ExpenseResourceClient.class.getSimpleName();

    // used to access app resources
    private final Context mContext;

    // REST consumer
    private ExpenseResource mExpenseResource;

    // used to open / close websocket connections
    private Socket mSocket;
    private String mUsername;

    public ExpenseResourceClient(Context context){
        mContext = context;
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(context.getString(R.string.server_url))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        mExpenseResource = retrofit.create(ExpenseResource.class);
    }

    public Observable<ExpenseDto> add$(String authorization, ExpenseDto expenseDto){
        Log.d(TAG, "add$");
        return mExpenseResource.add$(authorization, expenseDto);
    }

}
