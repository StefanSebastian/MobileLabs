package com.example.sebi.androidappreactive;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;

public class MenuActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        Button tagView = (Button) findViewById(R.id.tagMenuButton);
        tagView.setOnClickListener(v -> openTagMenu());
    }

    private void openTagMenu(){
        startActivity(new Intent(this, TagActivity.class));
    }
}
