package com.example.sebi.androidapp;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.example.sebi.androidapp.content.Tag;
import com.example.sebi.androidapp.util.OkCancellableCall;
import com.example.sebi.androidapp.util.OnErrorListener;
import com.example.sebi.androidapp.util.OnSuccessListener;
import com.example.sebi.androidapp.widget.TagListAdapter;

import java.util.List;

public class TagListFragment extends Fragment {
    public static final String TAG = TagListFragment.class.getSimpleName();

    private SpendingApp mApp;
    private TagListAdapter mTagListAdapter;
    private AsyncTask<String, Void, List<Tag>> mGetTagsAsyncTask;
    private ListView mTagListView;
    private View mContentLoadingView;
    private boolean mContentLoaded = false;
    private OkCancellableCall mGetTagsAsyncCall;

    public TagListFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreate");
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        Log.d(TAG, "onCreateView");
        View layout = inflater.inflate(R.layout.fragment_tag_list, container, false);
        mTagListView = layout.findViewById(R.id.tag_list);
        mContentLoadingView = layout.findViewById(R.id.content_loading);
        showLoadingIndicator();
        return layout;
    }

    @Override
    public void onStart() {
        Log.d(TAG, "onStart");
        super.onStart();
        startGetTagsAsyncCall();
    }

    @Override
    public void onAttach(Context context) {
        Log.d(TAG, "onAttach");
        super.onAttach(context);
        mApp = (SpendingApp) context.getApplicationContext();
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onStop() {
        Log.d(TAG, "onStop");
        super.onStop();
        ensureGetTagsAsyncCallCancelled();
    }

    private void startGetTagsAsyncCall() {
        if (mContentLoaded) {
            Log.d(TAG, "startGetTagsAsyncCall - content already loaded, return");
            return;
        }
        mGetTagsAsyncCall = mApp.getTagManager().getTagsAsync(
                new OnSuccessListener<List<Tag>>() {
                    @Override
                    public void onSuccess(final List<Tag> tags) {
                        Log.d(TAG, "startGetNotesAsyncCall - success");
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                showContent(tags);
                            }
                        });
                    }
                }, new OnErrorListener() {
                    @Override
                    public void onError(final Exception e) {
                        Log.d(TAG, "startGetNotesAsyncCall - error");
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                showError(e);
                            }
                        });
                    }
                }
        );
    }

    private void ensureGetTagsAsyncCallCancelled() {
        if (mGetTagsAsyncCall != null) {
            Log.d(TAG, "ensureGetTagsAsyncCallCancelled - cancelling the task");
            mGetTagsAsyncCall.cancel();
        }
    }

    private void showError(Exception e) {
        Log.e(TAG, "showError", e);
        new AlertDialog.Builder(getActivity())
                .setTitle("Error")
                .setMessage(e.getMessage())
                .setCancelable(true)
                .create()
                .show();
    }

    private void showContent(final List<Tag> tags) {
        Log.d(TAG, "showContent");
        mTagListAdapter = new TagListAdapter(this.getContext(), tags);
        mTagListView.setAdapter(mTagListAdapter);
        mContentLoadingView.setVisibility(View.GONE);
        mTagListView.setVisibility(View.VISIBLE);
    }

    private void showLoadingIndicator() {
        Log.d(TAG, "showLoadingIndicator");
        mTagListView.setVisibility(View.GONE);
        mContentLoadingView.setVisibility(View.VISIBLE);
    }
}
