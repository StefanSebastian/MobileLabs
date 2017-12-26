package com.example.sebi.androidappreactive.net.expenses;

import com.example.sebi.androidappreactive.net.tags.TagDto;

import io.reactivex.Observable;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * Created by Sebi on 26-Dec-17.
 */

public interface ExpenseResource {
    @POST("api/expense")
    Observable<ExpenseDto> add$(@Header("Authorization") String authorization, @Body ExpenseDto expense);

}
