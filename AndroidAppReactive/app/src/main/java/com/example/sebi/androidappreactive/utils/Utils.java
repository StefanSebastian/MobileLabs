package com.example.sebi.androidappreactive.utils;


import android.graphics.Color;

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
    public static String listToString(List<?> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n");
        for (Object obj : list) {
            sb.append(obj.toString()).append("\n");
        }
        return sb.toString();
    }

    public static String dateToIso8601(Date date){
        TimeZone tz = TimeZone.getTimeZone("UTC");
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
        df.setTimeZone(tz);
        return df.format(date);
    }

    public static DateFormat getDefaultDateFormat(){
        return new SimpleDateFormat("MMM dd, yyyy HH:mm:ss");
    }

    public static int getRandomColor(){
        Random rnd = new Random();
        return Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
    }
}
