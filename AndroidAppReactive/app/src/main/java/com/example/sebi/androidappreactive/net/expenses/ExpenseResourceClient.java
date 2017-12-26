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

    /*
   Stream of events from the server
    */
    public Observable<ExpenseEvent> expenseSocket$(String username){
        mUsername = username;
        /*
        Observable with custom subscribe event
         */
        return Observable.create(new ObservableOnSubscribe<ExpenseEvent>() {
            private ObservableEmitter<ExpenseEvent> mObservableEmitter;

            /*
            On subscribe open socket io connection
            and set event handler
             */
            @Override
            public void subscribe(ObservableEmitter<ExpenseEvent> e) throws Exception {
                Log.d(TAG, "subscribe");
                mObservableEmitter = e;
                try {
                    mSocket = IO.socket(mContext.getString(R.string.server_url));
                    mSocket.on(Socket.EVENT_CONNECT, (args) -> Log.d(TAG, "Socket connected"));
                    mSocket.on(Socket.EVENT_DISCONNECT, (args) -> Log.d(TAG, "Socket disconnected"));
                    mSocket.on("expense/created", (args) -> onNext(ExpenseEvent.Type.CREATED, args));
                    mSocket.on("expense/updated", (args) -> onNext(ExpenseEvent.Type.UPDATED, args));
                    mSocket.on("expense/deleted", (args) -> onNext(ExpenseEvent.Type.DELETED, args));
                    mSocket.connect();
                    mSocket.emit("userIdentification", username);
                } catch (Exception ex) {
                    Log.e(TAG, "Socket error", ex);
                }
            }

            /*
            Parse json object and let the emitter handle onNext
             */
            private void onNext(ExpenseEvent.Type eventType, Object[] args) {
                if (mObservableEmitter != null) {
                    if (mObservableEmitter.isDisposed()) {
                        mSocket.emit("userDisconnect", username);
                        mSocket.disconnect();
                    } else {
                        mObservableEmitter.onNext(new ExpenseEvent(eventType, readExpense(args)));
                    }
                }
            }
        });
    }

    private ExpenseDto readExpense(Object[] args) {
        try {
            JSONObject obj = (JSONObject) args[0];
            ExpenseDto expenseDto = new ExpenseDto();
            expenseDto.setmId(obj.getString("_id"));
            expenseDto.setmInfo(obj.getString("info"));
            expenseDto.setmTagName(obj.getString("tagName"));
            expenseDto.setmAmount(obj.getDouble("amount"));

            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
            Date date = formatter.parse(obj.getString("timestamp").replaceAll("Z$", "+0000"));

            expenseDto.setmTimestamp(date);

            Log.d(TAG, String.format("readExpense %s", obj.toString()));
            return expenseDto;
        } catch (JSONException | ParseException e) {
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
