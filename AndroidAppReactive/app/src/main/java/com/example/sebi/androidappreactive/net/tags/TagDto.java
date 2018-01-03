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

    @SerializedName("version")
    private Integer mVersion;

    @SerializedName("user")
    private String mUserId;

    public TagDto() {
    }

    public TagDto(String mId, String mName, Integer mVersion) {
        this.mId = mId;
        this.mName = mName;
        this.mVersion = mVersion;
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

    public Integer getmVersion() {
        return mVersion;
    }

    public void setmVersion(Integer mVersion) {
        this.mVersion = mVersion;
    }

    @Override
    public String toString() {
        return "TagDto{" +
                "mId='" + mId + '\'' +
                ", mName='" + mName + '\'' +
                ", mVersion=" + mVersion +
                '}';
    }

    public Tag toTag(){
        Tag tag = new Tag();
        tag.setId(mId);
        tag.setName(mName);
        tag.setVersion(mVersion);
        tag.setUserId(mUserId);
        return tag;
    }


    public String getmUserId() {
        return mUserId;
    }

    public void setmUserId(String mUserId) {
        this.mUserId = mUserId;
    }
}
