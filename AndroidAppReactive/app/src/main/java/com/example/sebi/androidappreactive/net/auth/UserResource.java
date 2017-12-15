package com.example.sebi.androidappreactive.net.auth;

import com.example.sebi.androidappreactive.model.User;

import io.reactivex.Observable;
import retrofit2.http.Body;
import retrofit2.http.POST;

/**
 * Created by Sebi on 11-Dec-17.
 */

public interface UserResource {
    @POST("api/auth/session")
    Observable<TokenDto> login$(@Body User user);
}
