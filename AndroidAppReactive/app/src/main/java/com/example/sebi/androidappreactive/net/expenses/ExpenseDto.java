package com.example.sebi.androidappreactive.net.expenses;

import com.example.sebi.androidappreactive.model.Expense;
import com.google.gson.annotations.SerializedName;

import java.util.Date;

/**
 * Created by Sebi on 26-Dec-17.
 */

public class ExpenseDto {
    @SerializedName("_id")
    private String mId;

    @SerializedName("info")
    private String mInfo;

    @SerializedName("timestamp")
    private Date mTimestamp;

    @SerializedName("amount")
    private Double mAmount;

    @SerializedName("tagId")
    private String mTagId;

    @SerializedName("user")
    private String mUserId;

    public ExpenseDto() {
    }

    public String getmId() {
        return mId;
    }

    public void setmId(String mId) {
        this.mId = mId;
    }

    public String getmInfo() {
        return mInfo;
    }

    public void setmInfo(String mInfo) {
        this.mInfo = mInfo;
    }

    public Date getmTimestamp() {
        return mTimestamp;
    }

    public void setmTimestamp(Date mTimestamp) {
        this.mTimestamp = mTimestamp;
    }

    public Double getmAmount() {
        return mAmount;
    }

    public void setmAmount(Double mAmount) {
        this.mAmount = mAmount;
    }

    public String getmTagId() {
        return mTagId;
    }

    public void setmTagId(String mTagId) {
        this.mTagId = mTagId;
    }

    public Expense toExpense(){
        Expense expense = new Expense();
        expense.setAmount(mAmount);
        expense.setId(mId);
        expense.setInfo(mInfo);
        expense.setTagId(mTagId);
        expense.setTimestamp(mTimestamp);
        expense.setUserId(mUserId);
        return expense;
    }

    public String getmUserId() {
        return mUserId;
    }

    public void setmUserId(String mUserId) {
        this.mUserId = mUserId;
    }
}
