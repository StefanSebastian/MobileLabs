package com.example.sebi.androidappreactive.net.expenses;

import android.content.Context;
import android.util.Log;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.Tag;
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
import java.util.List;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.Single;
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


    /*
    A stream that returns a single value = a list ( result of get all )
     */
    public Single<List<Expense>> find$(String authorization){
        Log.d(TAG, "find$");
        return mExpenseResource.find$(authorization)
                .flatMap(dtos -> Observable.fromArray(dtos.toArray(new ExpenseDto[dtos.size()])))
                .map(ExpenseDto::toExpense)
                .toList();
    }

    public Observable<ExpenseDto> delete$(String authorization, String id){
        Log.d(TAG, "delete$");
        return mExpenseResource.delete$(authorization, id);
    }
}
