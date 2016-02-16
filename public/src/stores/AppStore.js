import EventEmitter from 'events' ;
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';



const CHANGE_EVENT = 'change';

class AppStore extends EventEmitter {
  constructor() {
    super();
    this.storeData = {
      answerOptions: [],
      choosedAnswerOption: '',
      isDisplayedOptions: false,
      isLogin: false,
      terminatingChoosingOption: false,
      questionNumber: '',
      questionSentence: '',
      userID: '',
      isDisplayedQuestion: false
    }
  }

  closeQuestion() {
    this.storeData.answerOptions = [];
    this.storeData.choosedAnswerOption = '';
    this.storeData.isDisplayedOptions = false;
    this.storeData.terminatingChoosingOption = false;
    this.storeData.questionNumber = '';
    this.storeData.questionSentence = '';
    this.storeData.isDisplayedQuestion = false;
  }

  deployQuestion(questionData) {
    this.storeData.questionSentence = questionData.questionSentence;
    this.storeData.questionNumber = questionData.questionNumber;
    this.storeData.answerOptions = questionData.answerOptions;
    this.storeData.isDisplayedQuestion = true;
    this.storeData.isDisplayedOptions = false;
  }

  displayAnswerOptions() {
    this.storeData.isDisplayedOptions = true;
  }

  displayChoosedOption(deliveredData) {
    this.storeData.choosedAnswerOption = deliveredData.choosedOption;
  }

  login(deliveredData) {
    this.storeData.userID = deliveredData.userID;
    this.storeData.isLogin = deliveredData.isLogin;
  }

  inputUserID(deliveredData) {
    this.storeData.userID = deliveredData.userID;
  }

  terminateChoosingOption() {
    this.storeData.terminatingChoosingOption = true;
  }

  getAllData() {
    return this.storeData;
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}

const as = new AppStore();

AppDispatcher.register(action => {
  console.log(action.actionType);
  switch (action.actionType) {
    case AppConstants.CLOSE_QUESTION:
      as.closeQuestion();
      break;
    case AppConstants.DEPLOY_QUESTION:
      as.deployQuestion(action.deliveredData);
      break;
    case AppConstants.DISPLAY_QUESTION:
      as.displayAnswerOptions();
      break;
    case AppConstants.DISPLAY_CHOOSED_OPTION:
      as.displayChoosedOption(action.deliveredData);
      break;
    case AppConstants.TERMINATE_CHOOSING_OPTION:
      as.terminateChoosingOption();
      break;
    case AppConstants.LOGIN:
      as.login(action.deliveredData);
      break;
    case AppConstants.INPUT_USERID:
      as.inputUserID(action.deliveredData);
      break;

    default:

  }

  as.emitChange();
});

module.exports = as;
