package com.example.sebi.androidappreactive;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

/**
 * Created by Sebi on 23-Dec-17.
 */

/*
Holds a tag detail fragment
 */
public class TagDetailActivity extends AppCompatActivity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tag_detail);

        // add the new fragment
        if (savedInstanceState == null) {
            // Create the detail fragment and add it to the activity
            // using a fragment transaction.
            Bundle arguments = new Bundle();
            arguments.putString(TagDetailFragment.TAG_ID,
                    getIntent().getStringExtra(TagDetailFragment.TAG_ID));
            TagDetailFragment fragment = new TagDetailFragment();
            fragment.setArguments(arguments);
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.tag_detail_container, fragment)
                    .commit();
        }
    }
}
