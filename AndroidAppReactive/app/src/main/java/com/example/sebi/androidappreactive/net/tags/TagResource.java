package com.example.sebi.androidappreactive.net.tags;

import com.example.sebi.androidappreactive.model.Tag;

import java.util.List;

import io.reactivex.Observable;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * Created by Sebi on 08-Dec-17.
 */

public interface TagResource {
    @GET("api/tag")
    Observable<List<TagDto>> find$(@Header("Authorization") String authorization);

    @POST("api/tag")
    Observable<TagDto> add$(@Header("Authorization") String authorization, @Body TagDto tag);
}
