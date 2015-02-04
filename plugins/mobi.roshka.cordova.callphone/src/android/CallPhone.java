package mobi.roshka.cordova.callphone;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.text.Editable;
import android.text.InputType;
import android.widget.EditText;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created with IntelliJ IDEA.
 * User: Stefano
 * Date: 12/17/13
 * Time: 10:58 AM
 * To change this template use File | Settings | File Templates.
 */
public class CallPhone extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final Context context=this.cordova.getActivity();
        if (action.equals("callNumber")) {
            final String number = args.getString(0);
            String numberUri = "tel:" + number.toString().trim();
            Intent callIntent = new Intent(Intent.ACTION_CALL, Uri.parse(numberUri));
            context.startActivity(callIntent);
            return true;
        }
        callbackContext.success("no funciono");
        return false;
    }
}