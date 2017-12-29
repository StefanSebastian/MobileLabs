package com.example.sebi.androidappreactive.views.tags;


import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.model.User;
import com.example.sebi.androidappreactive.net.tags.TagDto;
import com.example.sebi.androidappreactive.net.tags.TagResourceClient;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.utils.Utils;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;

import static android.view.View.GONE;

/**
 * Created by Sebi on 23-Dec-17.
 */

public class TagDetailFragment extends Fragment implements ServiceConnection{
    private static final String TAG = TagDetailFragment.class.getSimpleName();

    public static final String TAG_ID = "tag_id";

    /*
    Network communication
     */
    private TagResourceClient mTagResourceClient;

    private CompositeDisposable mDisposable = new CompositeDisposable();

    private String mAuthorization;

    /*
    Holds the selected Tag
     */
    private Tag mTag;

    private EditText mTagTextView;
    private Button mDeleteButton;
    private Button mUpdateButton;

    // loading
    private ProgressBar mProgressBar;
    private LinearLayout mDeleteUpdateContent;

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

        User user = mRealm.where(User.class).findFirst();
        mAuthorization = "Bearer " + user.getToken();

        mTagResourceClient = new TagResourceClient(this.getActivity());
    }

    @Override
    public void onStart(){
        super.onStart();
        Log.d(TAG, "on start");

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
        mDeleteButton = rootView.findViewById(R.id.tagDeleteButton);
        mDeleteButton.setOnClickListener(v -> deleteTag());
        mUpdateButton = rootView.findViewById(R.id.tagUpdateButton);
        mUpdateButton.setOnClickListener(v -> updateTag());

        mDeleteUpdateContent = rootView.findViewById(R.id.tagUpdateDeleteContent);
        mProgressBar = rootView.findViewById(R.id.tagUpdateDeleteProgress);
        setLoading(false);

        fillTagDetails();

        return rootView;
    }

    @Override
    public void onStop() {
        Log.d(TAG, "onStop");
        super.onStop();
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        super.onDestroy();

        mDisposable.dispose();
    }

    private void fillTagDetails(){
        if (mTag != null){
            mTagTextView.setText(mTag.getName());
        }
    }


    private void deleteTag(){
        Log.d(TAG, "deleting " + mTag.getId());

        setLoading(true);

        mDisposable.add(mTagResourceClient.delete$(mAuthorization, mTag.getId())
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                    tag -> {
                        Popups.displayNotification("Success", getContext());
                        startActivity(new Intent(getContext(), TagListActivity.class));
                        setLoading(false);
                    },
                    error -> {
                        String msg = error.getMessage();
                        String parsed = Utils.getErrorMessageFromHttp(error);
                        msg = parsed == null ? msg : parsed;
                        Log.e(TAG, "error deleting tag", error);

                        Popups.displayError(msg, getContext());
                        setLoading(false);
                    }
            )
        );
    }

    private void updateTag(){
        Log.d(TAG, "updating tag");

        setLoading(true);

        String newName = mTagTextView.getText().toString();
        TagDto tagDto = new TagDto(mTag.getId(), newName, mTag.getVersion());
        mDisposable.add(mTagResourceClient.update$(mAuthorization, mTag.getId(), tagDto)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                    tagDtoReceived -> {
                        Popups.displayNotification("Success", getContext());
                        // update the local reference
                        Log.d(TAG, "Received as update response " + tagDtoReceived.toString());
                        mTag = tagDtoReceived.toTag();
                        setLoading(false);
                    },
                    error -> {
                        String msg = error.getMessage();
                        String parsed = Utils.getErrorMessageFromHttp(error);
                        msg = parsed == null ? msg : parsed;
                        Log.e(TAG, "error updating tag", error);

                        Popups.displayError(msg, getContext());
                        setLoading(false);
                    }
            )
        );
    }

    private void setLoading(Boolean loading){
        if (loading){
            mDeleteUpdateContent.setVisibility(View.GONE);
            mProgressBar.setVisibility(View.VISIBLE);
        } else {
            mDeleteUpdateContent.setVisibility(View.VISIBLE);
            mProgressBar.setVisibility(View.GONE);
        }
    }

    /*
    Service communication
     */
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        Log.d(TAG, "service connected");
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        Log.d(TAG, "service disconnected");
    }
}
