package com.example.sebi.androidappreactive;

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
import android.widget.ProgressBar;
import android.widget.TextView;

import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;

import java.util.List;

import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

public class TagListActivity extends AppCompatActivity implements ServiceConnection {
    private static final String TAG = TagListActivity.class.getSimpleName();

    // local storage
    private Realm mRealm;
    private RealmChangeListener mRealmRealmChangeListener = realm -> updateUi();
    private RealmResults<Tag> mTags;

    private RecyclerView mRecyclerView;
    private ProgressBar mContentLoadingView;

    /*
    Modifies the list to be displayed
    called for every change in the realm
     */
    private void updateUi() {
        mContentLoadingView.setVisibility(View.GONE);
        mRecyclerView.setVisibility(View.VISIBLE);

        mRecyclerView.setAdapter(new TagRecyclerViewAdapter(mTags));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tag_list);

        // get loading and list view
        mContentLoadingView = findViewById(R.id.tag_list_content_loading);
        mRecyclerView = findViewById(R.id.tag_list);

        // loading is set to visible
        mContentLoadingView.setVisibility(View.VISIBLE);

        // get realm and the initial values for the tags
        mRealm = Realm.getDefaultInstance();
        mTags = mRealm.where(Tag.class).findAll();

        // update UI
        updateUi();
    }

    @Override
    protected void onStart() {
        super.onStart();
        bindService(new Intent(this, SpenderService.class), this, BIND_AUTO_CREATE);

        mRealm.addChangeListener(mRealmRealmChangeListener);
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
    }

    /*
    Service binding methods
     */

    @Override
    public void onServiceConnected(ComponentName name, IBinder binder) {
        Log.d(TAG, "onServiceConnected");
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        Log.d(TAG, "onServiceDisconnected");
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
