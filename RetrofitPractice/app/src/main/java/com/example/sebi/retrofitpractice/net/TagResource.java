package com.example.sebi.retrofitpractice.net;

import java.util.List;

import io.reactivex.Observable;
import retrofit2.http.GET;

/**
 * Created by Sebi on 08-Dec-17.
 */
public interface TagResource {
    @GET("tag")
    Observable<List<TagDto>> find$();
}
