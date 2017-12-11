package com.example.sebi.androidappreactive.net;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Sebi on 11-Dec-17.
 */

public class UserDto {
    @SerializedName("username")
    private String username;

    @SerializedName("password")
    private String password;

    public UserDto() {
    }

    public UserDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
