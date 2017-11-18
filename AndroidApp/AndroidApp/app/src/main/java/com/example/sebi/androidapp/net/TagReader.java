package com.example.sebi.androidapp.net;

import android.util.JsonReader;
import android.util.Log;

import com.example.sebi.androidapp.content.Tag;
import com.example.sebi.androidapp.util.ResourceReader;

import java.io.IOException;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class TagReader implements ResourceReader<Tag> {
    private static final String TAG = TagReader.class.getSimpleName();

    public static final String TAG_ID = "id";
    public static final String TAG_NAME = "name";

    @Override
    public Tag read(JsonReader reader) throws IOException {
        Tag tag = new Tag();
        reader.beginObject();
        while (reader.hasNext()){
            String name = reader.nextName();
            if (name.equals(TAG_ID)){
                tag.setId(reader.nextInt());
            } else if (name.equals(TAG_NAME)){
                tag.setName(reader.nextString());
            } else {
                reader.skipValue();
                Log.w(TAG, "Log property " + name + " ignored");
            }
        }
        reader.endObject();
        return tag;
    }
}
