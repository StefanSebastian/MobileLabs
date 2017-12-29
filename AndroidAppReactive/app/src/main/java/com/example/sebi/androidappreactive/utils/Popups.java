package com.example.sebi.androidappreactive.utils;

import android.content.Context;
import android.widget.Toast;

/**
 * Created by Sebi on 23-Dec-17.
 */

public class Popups {
    /*
    Display a popup for errors
     */
    public static void displayError(String msg, Context context){
        Toast toast = Toast.makeText(context, msg, Toast.LENGTH_SHORT);
        toast.show();
    }

    /*
    Display a popup for notifications
     */
    public static void displayNotification(String msg, Context context){
        Toast toast = Toast.makeText(context, msg, Toast.LENGTH_SHORT);
        toast.show();

    }
}
