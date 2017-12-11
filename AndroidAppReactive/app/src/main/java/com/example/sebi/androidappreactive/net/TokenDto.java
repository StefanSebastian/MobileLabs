package com.example.sebi.androidappreactive.net;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Sebi on 11-Dec-17.
 */

public class TokenDto {
    @SerializedName("token")
    private String token;

    public TokenDto(String token) {
        this.token = token;
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
}
