package com.example.sebi.androidappreactive.utils;


import android.graphics.Color;
import android.util.Log;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.jakewharton.retrofit2.adapter.rxjava2.HttpException;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.TimeZone;

/**
 * Created by Sebi on 11-Dec-17.
 */

public class Utils {

    /*
    Returns a DateFormat with the format used in the application
     */
    public static DateFormat getDefaultDateFormat(){
        return new SimpleDateFormat("MMM dd, yyyy HH:mm:ss");
    }

    /*
    Returns the code of a random color
     */
    public static int getRandomColor(){
        Random rnd = new Random();
        return Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
    }

    /*
    Extracts the error string from a json issue message
     */
    private static String getErrorFromJsonIssue(String jsonIssue){
        JsonElement jelement = new JsonParser().parse(jsonIssue);
        JsonObject jobject = jelement.getAsJsonObject();

        JsonArray jarray = jobject.getAsJsonArray("issue");

        jobject = jarray.get(0).getAsJsonObject();

        return jobject.get("error").getAsString();
    }

    /*
    Extracts the error message if the Throwable is an HttpException
     */
    public static String getErrorMessageFromHttp(Throwable error){
        String msg = null;
        if (error instanceof HttpException){
            HttpException e = (HttpException) error;
            try {
                msg = e.response().errorBody().string();
                msg = getErrorFromJsonIssue(msg);
            } catch (IOException ignored) {
            }
        }
        return msg;
    }
}
