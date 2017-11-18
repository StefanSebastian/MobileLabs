package com.example.sebi.androidapp.content;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class Tag {
    private Integer mId;
    private String mName;

    public Tag(Integer mId, String mName) {
        this.mId = mId;
        this.mName = mName;
    }

    public Tag() {
    }

    public Integer getId() {
        return mId;
    }

    public void setId(Integer mId) {
        this.mId = mId;
    }

    public String getName() {
        return mName;
    }

    public void setName(String mName) {
        this.mName = mName;
    }
}
