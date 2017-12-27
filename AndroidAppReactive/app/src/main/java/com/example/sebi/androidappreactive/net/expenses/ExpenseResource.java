package com.example.sebi.androidappreactive.net.expenses;

import com.example.sebi.androidappreactive.net.tags.TagDto;

import java.util.List;

import io.reactivex.Observable;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * Created by Sebi on 26-Dec-17.
 */

public interface ExpenseResource {
    @GET("api/expense")
    Observable<List<ExpenseDto>> find$(@Header("Authorization") String authorization);

    @POST("api/expense")
    Observable<ExpenseDto> add$(@Header("Authorization") String authorization, @Body ExpenseDto expense);

}
