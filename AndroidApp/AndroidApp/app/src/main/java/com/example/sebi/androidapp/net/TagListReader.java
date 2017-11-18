package com.example.sebi.androidapp.net;

import android.util.JsonReader;

import com.example.sebi.androidapp.content.Tag;
import com.example.sebi.androidapp.util.ResourceListReader;
import com.example.sebi.androidapp.util.ResourceReader;

import java.io.IOException;
import java.util.List;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class TagListReader implements ResourceReader<List<Tag>> {
    @Override
    public List<Tag> read(JsonReader reader) throws IOException {
        List<Tag> tags = null;

        reader.beginObject();

        String name = reader.nextName();
        if (name.equals("page")){
            reader.skipValue();
        }

        name = reader.nextName();
        if (name.equals("tags")){
            tags = new ResourceListReader<Tag>(new TagReader()).read(reader);
        }

        name = reader.nextName();
        if (name.equals("more")){
            reader.skipValue();
        }

        reader.endObject();

        return tags;
    }
}
