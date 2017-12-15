package com.example.sebi.androidappreactive.net.tags;

import java.util.List;

import io.reactivex.Observable;
import retrofit2.http.GET;
import retrofit2.http.Header;

/**
 * Created by Sebi on 08-Dec-17.
 */

public interface TagResource {
    @GET("api/tag")
    Observable<List<TagDto>> find$(@Header("Authorization") String authorization);
}
