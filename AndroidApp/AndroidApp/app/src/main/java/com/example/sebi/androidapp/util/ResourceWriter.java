package com.example.sebi.androidapp.util;

import android.util.JsonWriter;

import java.io.IOException;

/**
 * Created by Sebi on 18-Nov-17.
 */

public interface ResourceWriter<E> {
    void write(E e, JsonWriter jsonWriter) throws IOException;
}
