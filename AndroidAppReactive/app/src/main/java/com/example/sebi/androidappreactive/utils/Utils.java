package com.example.sebi.androidappreactive.utils;

import java.util.List;

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
}
