package com.example.sebi.androidappreactive.net.auth;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Sebi on 11-Dec-17.
 */

/*
Result of login network call
 */
public class TokenDto {
    @SerializedName("token")
    private String token;

    @SerializedName("id")
    private String userId;

    public TokenDto(String token, String userId) {
        this.token = token;
        this.userId = userId;
    }

    public TokenDto() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "TokenDto{" +
                "token='" + token + '\'' +
                '}';
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
