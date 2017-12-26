package com.example.sebi.androidappreactive.net;

import android.content.Context;
import android.util.Log;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.net.expenses.ExpenseDto;
import com.example.sebi.androidappreactive.net.expenses.ExpenseEvent;
import com.example.sebi.androidappreactive.net.tags.TagDto;
import com.example.sebi.androidappreactive.net.tags.TagEvent;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.socket.client.IO;
import io.socket.client.Socket;

/**
 * Created by Sebi on 26-Dec-17.
 */

/*
Returns a socket connection as an observable object
treats all events in app
 */
public class SocketClient {
    public static final String TAG = SocketClient.class.getSimpleName();

    private String mUsername;
    private Socket mSocket;
    private Context mContext;

    public SocketClient(Context context){
        mContext = context;
    }

    /*
    Stream of events from the server
    */
    public Observable<SpenderEvent> eventSocket$(String username){
        mUsername = username;
        /*
        Observable with custom subscribe event
         */
        return Observable.create(new ObservableOnSubscribe<SpenderEvent>() {
            private ObservableEmitter<SpenderEvent> mObservableEmitter;

            /*
            On subscribe open socket io connection
            and set event handler
             */
            @Override
            public void subscribe(ObservableEmitter<SpenderEvent> e) throws Exception {
                Log.d(TAG, "subscribe");
                mObservableEmitter = e;
                try {
                    mSocket = IO.socket(mContext.getString(R.string.server_url));
                    mSocket.on(Socket.EVENT_CONNECT, (args) -> Log.d(TAG, "Socket connected"));
                    mSocket.on(Socket.EVENT_DISCONNECT, (args) -> Log.d(TAG, "Socket disconnected"));
                    mSocket.on("tag/created", (args) -> onNextTag(TagEvent.Type.CREATED, args));
                    mSocket.on("tag/updated", (args) -> onNextTag(TagEvent.Type.UPDATED, args));
                    mSocket.on("tag/deleted", (args) -> onNextTag(TagEvent.Type.DELETED, args));
                    mSocket.on("expense/created", (args) -> onNextExpense(ExpenseEvent.Type.CREATED, args));
                    mSocket.on("expense/updated", (args) -> onNextExpense(ExpenseEvent.Type.UPDATED, args));
                    mSocket.on("expense/deleted", (args) -> onNextExpense(ExpenseEvent.Type.DELETED, args));
                    mSocket.connect();
                    mSocket.emit("userIdentification", username);
                } catch (Exception ex) {
                    Log.e(TAG, "Socket error", ex);
                }
            }

            /*
            Parse json object and let the emitter handle onNext
             */
            private void onNextTag(TagEvent.Type eventType, Object[] args) {
                if (mObservableEmitter != null) {
                    if (mObservableEmitter.isDisposed()) {
                        mSocket.emit("userDisconnect", username);
                        mSocket.disconnect();
                    } else {
                        SpenderEvent spenderEvent = new SpenderEvent(SpenderEvent.Type.TAG, new TagEvent(eventType, readTag(args)), null);
                        mObservableEmitter.onNext(spenderEvent);
                    }
                }
            }

            /*
           Parse json object and let the emitter handle onNext
            */
            private void onNextExpense(ExpenseEvent.Type eventType, Object[] args) {
                if (mObservableEmitter != null) {
                    if (mObservableEmitter.isDisposed()) {
                        mSocket.emit("userDisconnect", username);
                        mSocket.disconnect();
                    } else {
                        SpenderEvent spenderEvent = new SpenderEvent(SpenderEvent.Type.EXPENSE, null, new  ExpenseEvent(eventType, readExpense(args)));
                        mObservableEmitter.onNext(spenderEvent);
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
            tagDto.setmVersion(obj.getInt("version"));
            Log.d(TAG, String.format("readTag %s", obj.toString()));
            return tagDto;
        } catch (JSONException e) {
            Log.d(TAG, "read tag", e);
            return null;
        }
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
