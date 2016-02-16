import Mongoose from 'mongoose'

let currentQuestionNumber = 0;
let questionList = [];
let startTime = 0;
let choosedResultList = [];
let choosedResultMap = {};

const userInfoSchema = new Mongoose.Schema({
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

const questionSchema = new Mongoose.Schema({
  questionSentence: {
    type: String
  },
  answerOptions: [
    {
      number: {
        type: String,
        answerSentence: String
      }
    }
  ]
});

const choosedResultSchema = new Mongoose.Schema({
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
})

Mongoose.model('UserInfo', userInfoSchema);
Mongoose.model('Question', questionSchema);
Mongoose.model('ChoosedResult', choosedResultSchema);

if (process.env.MONGOLAB_URI) {
  Mongoose.connect(process.env.MONGOLAB_URI);
} else {
  Mongoose.connect('mongodb://localhost/test');
}


const UserInfo = Mongoose.model('UserInfo');

const Questions = Mongoose.model('Question');

const ChoosedResult = Mongoose.model('ChoosedResult');

Questions.find({}, (err, doc) => {
  questionList = doc;
});

class appLogic {
  init() {
    currentQuestionNumber = 0;
    ChoosedResult.remove({}, err => {
      if (err) {
        console.log(err);
      }
    })
  }

  start(callback) {
    startTime = new Date();
    callback({
      actionType: 'start',
      deliveredData: ''
    });
  }
  end(callback) {
    callback({
      actionType: 'end',
      deliveredData: ''
    });
  }

  recieveAnswer(questionAnswer) {
    let answerOption = questionAnswer.answerOption;
    choosedResultList.map(element => {
      if (element.choosedOption == answerOption) {
        element.point = 1;
      } else {
        element.point = 0;
      }
      let choosedResult = new ChoosedResult(element);
      choosedResult.save(err => {
        if (err) {
          console.log(err);
        }
      })
    })
  }
  login(authenticationData, callback) {
    let isLogin = false;
    UserInfo.find({
      userID: authenticationData.userID,
      pass: authenticationData.pass
    }, (err, doc) => {
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
  sendQuestion(callback) {
    choosedResultList = [];
    choosedResultMap = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0
    }
    let questionData = questionList[currentQuestionNumber];
    currentQuestionNumber = currentQuestionNumber + 1;
    questionData.questionNumber = currentQuestionNumber;
    callback({
      actionType: 'deployQuestion',
      deliveredData: questionData
    });
    console.log('emitQuestion');
  }

  sendChoosedResults(callback) {
    callback({
      actionType: 'displayChoosedResults',
      deliveredData: choosedResultMap
    })
  }

  sendRanking(callback) {
    ChoosedResult.aggregate([
      {
        '$group': {
          '_id': '$userID',
          'sumPoint': {
            '$sum': '$point'
          },
          'sumTime': {
            '$sum': '$spentTime'
          }
        }
      },
      {
        '$sort': [
          {
            'sumePoint': 1
          },
          {
            'sumTime': -1
          }
        ]
      }
    ], (err, docs) => {
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

  storeChooesedOption(storedData) {
    let spentTime = new Date() - startTime;
    storedData.spentTime = spentTime;
    choosedResultList.push(storedData);
    switch (storedData.choosedOption) {
      case '1':
        choosedResultMap.first = choosedResultMap.first + 1
        break;
      case '2':
        choosedResultMap.second = choosedResultMap.second + 1
        break;
      case '3':
        choosedResultMap.third = choosedResultMap.third + 1
        break;
      case '4':
        choosedResultMap.fourth = choosedResultMap.fourth + 1
        break;
      default:
    }
  }
}

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
