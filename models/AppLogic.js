'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var currentQuestionNumber = 0;
var questionList = [];
var startTime = 0;
var choosedResultList = [];
var choosedResultMap = {};

var userInfoSchema = new _mongoose2.default.Schema({
  userID: {
    type: String
  },
  pass: {
    type: String
  },
  displayedName: {
    type: String
  }
});

var questionSchema = new _mongoose2.default.Schema({
  questionSentence: {
    type: String
  },
  answerOptions: [{
    number: {
      type: String,
      answerSentence: String
    }
  }]
});

var choosedResultSchema = new _mongoose2.default.Schema({
  questionNumber: {
    type: String
  },
  point: {
    type: Number
  },
  spentTime: {
    type: Number
  },
  choosedOption: {
    type: String
  },
  userID: {
    type: String
  }
});

_mongoose2.default.model('UserInfo', userInfoSchema);
_mongoose2.default.model('Question', questionSchema);
_mongoose2.default.model('ChoosedResult', choosedResultSchema);

if (process.env.MONGOLAB_URI) {
  _mongoose2.default.connect(process.env.MONGOLAB_URI);
} else {
  _mongoose2.default.connect('mongodb://localhost/test');
}

var UserInfo = _mongoose2.default.model('UserInfo');

var Questions = _mongoose2.default.model('Question');

var ChoosedResult = _mongoose2.default.model('ChoosedResult');

Questions.find({}, function (err, doc) {
  questionList = doc;
});

var appLogic = function () {
  function appLogic() {
    _classCallCheck(this, appLogic);
  }

  _createClass(appLogic, [{
    key: 'init',
    value: function init() {
      currentQuestionNumber = 0;
      ChoosedResult.remove({}, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }, {
    key: 'start',
    value: function start(callback) {
      startTime = new Date();
      callback({
        actionType: 'start',
        deliveredData: ''
      });
    }
  }, {
    key: 'end',
    value: function end(callback) {
      callback({
        actionType: 'end',
        deliveredData: ''
      });
    }
  }, {
    key: 'recieveAnswer',
    value: function recieveAnswer(questionAnswer) {
      var answerOption = questionAnswer.answerOption;
      choosedResultList.map(function (element) {
        if (element.choosedOption == answerOption) {
          element.point = 1;
        } else {
          element.point = 0;
        }
        var choosedResult = new ChoosedResult(element);
        choosedResult.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  }, {
    key: 'login',
    value: function login(authenticationData, callback) {
      var isLogin = false;
      UserInfo.find({
        userID: authenticationData.userID,
        pass: authenticationData.pass
      }, function (err, doc) {
        if (Object.keys(doc).length != 0) {
          isLogin = true;
        }
        callback({
          actionType: 'login',
          deliveredData: {
            userID: authenticationData.userID,
            isLogin: isLogin
          }
        });
      });
    }
  }, {
    key: 'sendQuestion',
    value: function sendQuestion(callback) {
      choosedResultList = [];
      choosedResultMap = {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0
      };
      var questionData = questionList[currentQuestionNumber];
      currentQuestionNumber = currentQuestionNumber + 1;
      questionData.questionNumber = currentQuestionNumber;
      callback({
        actionType: 'deployQuestion',
        deliveredData: questionData
      });
      console.log('emitQuestion');
    }
  }, {
    key: 'sendChoosedResults',
    value: function sendChoosedResults(callback) {
      callback({
        actionType: 'displayChoosedResults',
        deliveredData: choosedResultMap
      });
    }
  }, {
    key: 'sendRanking',
    value: function sendRanking(callback) {
      ChoosedResult.aggregate([{
        '$group': {
          '_id': '$userID',
          'sumPoint': {
            '$sum': '$point'
          },
          'sumTime': {
            '$sum': '$spentTime'
          }
        }
      }, {
        '$sort': [{
          'sumePoint': 1
        }, {
          'sumTime': -1
        }]
      }], function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          callback({
            actionType: 'displayRanking',
            deliveredData: docs
          });
        }
      });
    }
  }, {
    key: 'storeChooesedOption',
    value: function storeChooesedOption(storedData) {
      var spentTime = new Date() - startTime;
      storedData.spentTime = spentTime;
      choosedResultList.push(storedData);
      switch (storedData.choosedOption) {
        case '1':
          choosedResultMap.first = choosedResultMap.first + 1;
          break;
        case '2':
          choosedResultMap.second = choosedResultMap.second + 1;
          break;
        case '3':
          choosedResultMap.third = choosedResultMap.third + 1;
          break;
        case '4':
          choosedResultMap.fourth = choosedResultMap.fourth + 1;
          break;
        default:
      }
    }
  }]);

  return appLogic;
}();

// var currentQuestionNumber = 0;
//


module.exports = appLogic;
//
// apriLogic.prototype.sendQuestion = function(callback) {
//   callback({
//     actionType: 'deployQuestion',
//     deliveredData: questionList.get(currentQuestionNumber)
//   });
// };
//
// apriLogic.prototype.displayRanking = function(callback) {};