package com.example.sebi.androidapp.widget;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.sebi.androidapp.R;
import com.example.sebi.androidapp.content.Tag;

import java.util.List;

/**
 * Created by Sebi on 18-Nov-17.
 */

public class TagListAdapter extends BaseAdapter {
    public static final String TAG = TagListAdapter.class.getSimpleName();

    private final Context mContext;
    private List<Tag> mTags;

    public TagListAdapter(Context context, List<Tag> tags) {
        mContext = context;
        mTags = tags;
    }


    @Override
    public int getCount() {
        return mTags.size();
    }

    @Override
    public Object getItem(int position) {
        return mTags.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View tagLayout = LayoutInflater.from(mContext).inflate(R.layout.tag_detail, null);
        ((TextView) tagLayout.findViewById(R.id.tag_text)).setText(mTags.get(position).getName());
        Log.d(TAG, "getView " + position);
        return tagLayout;
    }

    public void refresh() {
        notifyDataSetChanged();
    }
}
