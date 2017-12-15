package com.example.sebi.androidappreactive.net.tags;

import com.example.sebi.androidappreactive.model.Tag;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Sebi on 08-Dec-17.
 */

public class TagDto {
    @SerializedName("_id")
    private String mId;

    @SerializedName("name")
    private String mName;

    public TagDto() {
    }

    public TagDto(String mId, String mName) {
        this.mId = mId;
        this.mName = mName;
    }

    public String getmId() {
        return mId;
    }

    public void setmId(String mId) {
        this.mId = mId;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    @Override
    public String toString() {
        return "TagDto{" +
                "mId='" + mId + '\'' +
                ", mName='" + mName + '\'' +
                '}';
    }

    public Tag toTag(){
        Tag tag = new Tag();
        tag.setId(mId);
        tag.setName(mName);
        return tag;
    }
}
