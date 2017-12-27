package com.example.sebi.androidappreactive.views.expenses;

import android.content.ComponentName;
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

import com.example.sebi.androidappreactive.R;
import com.example.sebi.androidappreactive.model.Expense;
import com.example.sebi.androidappreactive.model.Tag;
import com.example.sebi.androidappreactive.service.SpenderService;
import com.example.sebi.androidappreactive.utils.Utils;
import com.example.sebi.androidappreactive.views.tags.TagListActivity;

import java.text.SimpleDateFormat;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmChangeListener;
import io.realm.RealmResults;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

/**
 * Created by Sebi on 27-Dec-17.
 */

public class ListExpenseActivity extends AppCompatActivity implements ServiceConnection {
    private static final String TAG = ListExpenseActivity.class.getSimpleName();

    // local storage
    private Realm mRealm;
    private RealmChangeListener mRealmChangeListener = realm -> updateUi();
    private RealmResults<Expense> mExpenses;

    // list view
    private RecyclerView mRecyclerView;
    private ProgressBar mContentLoadingView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expense_list);

        // get loading and list view
        mContentLoadingView = findViewById(R.id.expenseListContentLoading);
        mRecyclerView = findViewById(R.id.expenseList);

        // loading is set to visible
        mContentLoadingView.setVisibility(VISIBLE);
        mRecyclerView.setVisibility(GONE);

        // get realm and the initial values for the tags
        mRealm = Realm.getDefaultInstance();
        mExpenses = mRealm.where(Expense.class).findAll();

        setTitle("Expense list");

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
    }


    private void updateUi(){
        mRecyclerView.setAdapter(new ListExpenseActivity.ExpenseRecyclerViewAdapter(mExpenses));

        mContentLoadingView.setVisibility(GONE);
        mRecyclerView.setVisibility(VISIBLE);
    }


    // service connections
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {

    }

    @Override
    public void onServiceDisconnected(ComponentName name) {

    }


    /*
   View adapter class
    */
    class ExpenseRecyclerViewAdapter extends
            RecyclerView.Adapter<ListExpenseActivity.ExpenseRecyclerViewAdapter.ViewHolder>{
        /*
        List to display
         */
        private final List<Expense> mValues;

        ExpenseRecyclerViewAdapter(List<Expense> expenses){
            mValues = expenses;
        }

        /*
        Select layout for view holder
         */
        @Override
        public ListExpenseActivity.ExpenseRecyclerViewAdapter.ViewHolder
        onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.expense_list_content, parent, false);
            return new ListExpenseActivity.ExpenseRecyclerViewAdapter.ViewHolder(view);
        }

        /*
        When binding a view holder with data, set the corresponding text

        also sets on click listener the opening of detail menu
         */
        @Override
        public void onBindViewHolder(
                ListExpenseActivity.ExpenseRecyclerViewAdapter.ViewHolder holder,
                                     int position) {
            holder.mItem = mValues.get(position);
            holder.mExpenseInfo.setText(mValues.get(position).getInfo());

            String dateText = Utils.getDefaultDateFormat().format(mValues.get(position).getTimestamp());
            holder.mExpenseTimestamp.setText(dateText);
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
            final TextView mExpenseInfo;
            final TextView mExpenseTimestamp;
            Expense mItem;

            ViewHolder(View itemView) {
                super(itemView);

                mView = itemView;
                mExpenseInfo = itemView.findViewById(R.id.expenseInfoContent);
                mExpenseTimestamp = itemView.findViewById(R.id.expenseTimestampContent);
            }
        }
    }

}
