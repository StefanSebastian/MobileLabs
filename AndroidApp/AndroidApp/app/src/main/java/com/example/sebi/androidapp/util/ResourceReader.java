package com.example.sebi.androidapp.util;

import android.util.JsonReader;

import java.io.IOException;

/**
 * Created by Sebi on 18-Nov-17.
 */

public interface ResourceReader<E> {
    E read(JsonReader jsonReader) throws IOException;
}
