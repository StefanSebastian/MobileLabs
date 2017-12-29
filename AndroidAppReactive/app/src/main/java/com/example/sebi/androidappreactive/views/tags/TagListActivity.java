package com.example.sebi.androidappreactive.views.tags;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;
import com.example.sebi.androidappreactive.utils.Popups;
import com.example.sebi.androidappreactive.utils.Utils;

import java.util.List;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

public class TagListActivity extends AppCompatActivity implements ServiceConnection {
    private static final String TAG = TagListActivity.class.getSimpleName();

    // local storage
    private Realm mRealm;
    private RealmChangeListener mRealmChangeListener = realm -> updateUi();
    private RealmResults<Tag> mTags;

    // list view
    private RecyclerView mRecyclerView;
    private ProgressBar mContentLoadingView;

    // add view
    private ProgressBar mAddLoadingView;
    private Button mAddTagButton;
    private EditText mTagName;

    // service
    private SpenderService mSpenderService;

    // disposing of network calls
    private CompositeDisposable mDisposable = new CompositeDisposable();

    /*
    Modifies the list to be displayed
    called for every change in the realm
     */
    private void updateUi() {
        mRecyclerView.setAdapter(new TagRecyclerViewAdapter(mTags));

        mContentLoadingView.setVisibility(GONE);
        mRecyclerView.setVisibility(VISIBLE);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tag_list);

        // get loading and list view
        mContentLoadingView = findViewById(R.id.tag_list_content_loading);
        mRecyclerView = findViewById(R.id.tag_list);

        // add view
        mAddLoadingView = findViewById(R.id.tagAddProgress);
        mAddTagButton = findViewById(R.id.tagAddButton);
        mAddTagButton.setOnClickListener(v -> addTag());
        mTagName = findViewById(R.id.tagAddNameField);

        // loading is set to visible
        mAddLoadingView.setVisibility(GONE);
        mContentLoadingView.setVisibility(VISIBLE);

        // get realm and the initial values for the tags
        mRealm = Realm.getDefaultInstance();
        mTags = mRealm.where(Tag.class).findAll();

        setTitle("Tag list");

        // update UI
        updateUi();
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(TAG, "onStart");
        Log.d(TAG, "binding service");
        bindService(new Intent(this, SpenderService.class), this, BIND_AUTO_CREATE);

        mRealm.addChangeListener(mRealmChangeListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        unbindService(this);
        mRealm.removeAllChangeListeners();
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        mRealm.close();
        mDisposable.dispose();
    }


    /*
    Tag add
     */
    private void addTag(){
        setAddMenuVisibility(false);

        String tagName = mTagName.getText().toString();
        Log.d(TAG, "Adding " + tagName);

        if (mSpenderService == null){
            Popups.displayError("Service not connected", this);
        } else {
            Tag tag = new Tag();
            tag.setName(tagName);
            mDisposable.add(
                    mSpenderService.addTag(tag)
                            .subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(
                                tagDto -> {
                                    Popups.displayNotification("Successful add", this);
                                    setAddMenuVisibility(true);
                                },
                                error -> {
                                    String msg = error.getMessage();
                                    String parsed = Utils.getErrorMessageFromHttp(error);
                                    msg = parsed == null ? msg : parsed;
                                    Log.e(TAG, "error adding tag", error);

                                    Popups.displayError(msg, this);
                                    setAddMenuVisibility(true);
                                }
                    )
            );

        }


    }

    private void setAddMenuVisibility(Boolean visible){
        if (visible){
            mAddLoadingView.setVisibility(View.GONE);
            mTagName.setVisibility(VISIBLE);
            mAddTagButton.setVisibility(VISIBLE);
        } else {
            mAddLoadingView.setVisibility(VISIBLE);
            mTagName.setVisibility(GONE);
            mAddTagButton.setVisibility(GONE);
        }
    }


    /*
    Service binding methods
     */

    @Override
    public void onServiceConnected(ComponentName name, IBinder binder) {
        Log.d(TAG, "onServiceConnected");
        mSpenderService = ((SpenderService.ServiceBinder) binder).getService();
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        Log.d(TAG, "onServiceDisconnected");
        mSpenderService = null;
    }

    /*
    View adapter class
     */
    class TagRecyclerViewAdapter extends RecyclerView.Adapter<TagRecyclerViewAdapter.ViewHolder>{
        /*
        List to display
         */
        private final List<Tag> mValues;

        TagRecyclerViewAdapter(List<Tag> tags){
            mValues = tags;
        }

        /*
        Select layout for view holder
         */
        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.tag_list_content, parent, false);
            return new ViewHolder(view);
        }

        /*
        When binding a view holder with data, set the corresponding text

        also sets on click listener the opening of detail menu
         */
        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            holder.mItem = mValues.get(position);
            holder.mNameView.setText(mValues.get(position).getName());

            holder.mView.setOnClickListener(v -> {
                Context context = v.getContext();
                Intent intent = new Intent(context, TagDetailActivity.class);
                intent.putExtra(TagDetailFragment.TAG_ID, holder.mItem.getId());
                context.startActivity(intent);
            });
        }

        /*
        Item count is the size of the list
         */
        @Override
        public int getItemCount() {
            return mValues.size();
        }

        /*
        Holds a view - corresponding to an item
         */
        class ViewHolder extends RecyclerView.ViewHolder {
            final View mView;
            final TextView mNameView;
            Tag mItem;

            ViewHolder(View itemView) {
                super(itemView);

                mView = itemView;
                mNameView = itemView.findViewById(R.id.tag_content);
            }
        }
    }
}
