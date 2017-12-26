package com.example.sebi.androidappreactive.net;

import com.example.sebi.androidappreactive.net.expenses.ExpenseEvent;
import com.example.sebi.androidappreactive.net.tags.TagEvent;

/**
 * Created by Sebi on 26-Dec-17.
 */

public class SpenderEvent {
    public enum Type {TAG, EXPENSE};

    public final Type type;
    public final TagEvent tagEvent;
    public final ExpenseEvent expenseEvent;

    public SpenderEvent(Type type, TagEvent tagEvent, ExpenseEvent expenseEvent) {
        this.type = type;
        this.tagEvent = tagEvent;
        this.expenseEvent = expenseEvent;
    }
}
