package com.example.sebi.androidappreactive;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.sebi.androidappreactive.model.Tag;

import io.realm.Realm;

/**
 * Created by Sebi on 23-Dec-17.
 */

public class TagDetailFragment extends Fragment {
    private static final String TAG = TagDetailFragment.class.getSimpleName();

    public static final String TAG_ID = "tag_id";

    /*
    Holds the selected Tag
     */
    private Tag mTag;

    private TextView mTagTextView;

    private Realm mRealm;

    public TagDetailFragment(){}

    @Override
    public void onAttach(Context context) {
        Log.d(TAG, "onAttach");
        super.onAttach(context);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreate");
        super.onCreate(savedInstanceState);

        mRealm = Realm.getDefaultInstance();
        mTag = mRealm.where(Tag.class).equalTo("id", getArguments().getString(TAG_ID)).findFirst();
    }

    /*
    Sets the view
     */
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        Log.d(TAG, "onCreateView");

        View rootView = inflater.inflate(R.layout.tag_detail, container, false);
        mTagTextView = rootView.findViewById(R.id.tag_name);

        fillTagDetails();

        return rootView;
    }

    @Override
    public void onStop() {
        Log.d(TAG, "onStop");
        super.onStop();
    }

    private void fillTagDetails(){
        if (mTag != null){
            mTagTextView.setText(mTag.getName());
        }
    }
}
