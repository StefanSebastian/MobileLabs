package com.example.sebi.androidappreactive.model;

import java.util.Date;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Required;

/**
 * Created by Sebi on 26-Dec-17.
 */

public class Expense extends RealmObject{
    @PrimaryKey
    private String id;

    @Required
    private String info;

    @Required
    private Date timestamp;

    @Required
    private Double amount;

    @Required
    private String tagName;

    public Expense() {
    }

    public Expense(String id, String info, Date timestamp, Double amount, String tagName) {
        this.id = id;
        this.info = info;
        this.timestamp = timestamp;
        this.amount = amount;
        this.tagName = tagName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    @Override
    public String toString() {
        return "Expense{" +
                "id='" + id + '\'' +
                ", info='" + info + '\'' +
                ", timestamp=" + timestamp +
                ", amount=" + amount +
                ", tagName='" + tagName + '\'' +
                '}';
    }
}
