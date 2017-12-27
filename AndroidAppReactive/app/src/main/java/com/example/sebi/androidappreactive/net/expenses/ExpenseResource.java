package com.example.sebi.androidappreactive.net.expenses;

import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.net.tags.TagDto;

import java.util.List;

import io.reactivex.Observable;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 * Created by Sebi on 26-Dec-17.
 */

public interface ExpenseResource {
    @GET("api/expense")
    Observable<List<ExpenseDto>> find$(@Header("Authorization") String authorization);

    @POST("api/expense")
    Observable<ExpenseDto> add$(@Header("Authorization") String authorization, @Body ExpenseDto expense);

    @DELETE("api/expense/{id}")
    Observable<ExpenseDto> delete$(@Header("Authorization") String authorization, @Path("id") String id);
}
