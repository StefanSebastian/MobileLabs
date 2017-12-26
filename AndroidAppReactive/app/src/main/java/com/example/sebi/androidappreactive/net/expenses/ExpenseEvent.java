package com.example.sebi.androidappreactive.net.expenses;

import com.example.sebi.androidappreactive.model.Expense;

/**
 * Created by Sebi on 26-Dec-17.
 */

public class ExpenseEvent {
    public enum Type {CREATED, UPDATED, DELETED};

    public final Type type;
    public final ExpenseDto expenseDto;

    public ExpenseEvent(Type type, ExpenseDto expenseDto) {
        this.type = type;
        this.expenseDto = expenseDto;
    }

    @Override
    public String toString() {
        return "ExpenseEvent{" +
                "type=" + type +
                ", expenseDto=" + expenseDto +
                '}';
    }
}
