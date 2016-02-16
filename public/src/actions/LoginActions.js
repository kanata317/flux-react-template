import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

class LoginActions {
  inputUserID(userID) {
    AppDispatcher.dispatch({
      actionType: AppConstants.INPUT_USERID,
      deliveredData: {
        userID: userID
      }
    });
  }
}

module.exports = LoginActions;
