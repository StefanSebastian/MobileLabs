package com.example.sebi.androidappreactive.net;

/**
 * Created by Sebi on 08-Dec-17.
 */

public class TagEvent {
    public enum Type { CREATED, UPDATED, DELETED};

    public final Type type;
    public final TagDto tagDto;

    public TagEvent(Type type, TagDto tagDto) {
        this.type = type;
        this.tagDto = tagDto;
    }

    @Override
    public String toString() {
        return "TagEvent{" +
                "type=" + type +
                ", tagDto=" + tagDto +
                '}';
    }
}
