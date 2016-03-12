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
var choosedResults = [];

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
      type: String
    },
    answerSentence: {
      type: String
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
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'UserInfo'
  }
});

_mongoose2.default.model('UserInfo', userInfoSchema);
_mongoose2.default.model('Question', questionSchema);
_mongoose2.default.model('ChoosedResult', choosedResultSchema);

if (process.env.MONGOLAB_URI) {
  _mongoose2.default.connect(process.env.MONGOLAB_URI);
  console.log('a');
} else {
  _mongoose2.default.connect('mongodb://localhost/test');
  console.log('b');
}

var UserInfo = _mongoose2.default.model('UserInfo');

var Questions = _mongoose2.default.model('Question');

var ChoosedResult = _mongoose2.default.model('ChoosedResult');

Questions.find({}, function (err, doc) {
  if (err) {
    console.log(err);
  }
  console.log(doc);
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
    value: function recieveAnswer(questionAnswer, callback) {
      var answerOption = questionAnswer.answerOption;
      callback({
        actionType: 'displayAnswer',
        deliveredData: {
          answerOption: answerOption
        }
      });
      choosedResultList.map(function (element) {
        if (element.choosedOption == answerOption) {
          element.point = 1;
        } else {
          element.point = 0;
          element.time = 0;
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
      var id = "";
      UserInfo.find({
        userID: authenticationData.userID,
        pass: authenticationData.pass
      }, function (err, doc) {
        if (Object.keys(doc).length != 0) {
          isLogin = true;
          id = doc[0]._id;
        }
        callback({
          actionType: 'login',
          deliveredData: {
            userID: id,
            isLogin: isLogin
          }
        });
      });
    }
  }, {
    key: 'sendQuestion',
    value: function sendQuestion(callback) {
      choosedResultList = [];
      choosedResults = [0, 0, 0, 0];

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
        deliveredData: {
          choosedResults: choosedResults,
          countResults: choosedResultList.length
        }
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
          },
          'userID': {
            $first: '$userID'
          }

        }
      }, {
        '$sort': {
          'sumPoint': 1,
          'sumTime': -1

        }
      }], function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          ChoosedResult.populate(docs, {
            'path': 'userID'
          }, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              callback({
                actionType: 'displayRanking',
                deliveredData: result
              });
            }
          });
        }
      });
    }
  }, {
    key: 'send8Ranking',
    value: function send8Ranking(callback) {
      callback({
        actionType: 'display8Ranking'
      });
    }
  }, {
    key: 'send3Ranking',
    value: function send3Ranking(callback) {
      callback({
        actionType: 'display3Ranking'
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
          choosedResults[0] = choosedResults[0] + 1;
          break;
        case '2':
          choosedResults[1] = choosedResults[1] + 1;
          break;
        case '3':
          choosedResults[2] = choosedResults[2] + 1;
          break;
        case '4':
          choosedResults[3] = choosedResults[3] + 1;
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