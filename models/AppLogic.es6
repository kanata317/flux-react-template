import Mongoose from 'mongoose'

let currentQuestionNumber = 0;
let questionList = [];
let startTime = 0;
let choosedResultList = [];
let choosedResults = [];

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
        type: String
      },
      answerSentence: {
        type: String
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
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  }
})

Mongoose.model('UserInfo', userInfoSchema);
Mongoose.model('Question', questionSchema);
Mongoose.model('ChoosedResult', choosedResultSchema);

if (process.env.MONGOLAB_URI) {
  Mongoose.connect(process.env.MONGOLAB_URI);
  console.log('a');
} else {
  Mongoose.connect('mongodb://localhost/test');
  console.log('b');
}


const UserInfo = Mongoose.model('UserInfo');

const Questions = Mongoose.model('Question');

const ChoosedResult = Mongoose.model('ChoosedResult');

Questions.find({}, (err, doc) => {
  if (err) {
    console.log(err);
  }
  console.log(doc);
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

  recieveAnswer(questionAnswer, callback) {
    let answerOption = questionAnswer.answerOption;
    callback({
      actionType: 'displayAnswer',
      deliveredData: {
        answerOption: answerOption
      }
    });
    choosedResultList.map(element => {
      if (element.choosedOption == answerOption) {
        element.point = 1;
      } else {
        element.point = 0;
        element.time = 0;
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
    let id = "";
    UserInfo.find({
      userID: authenticationData.userID,
      pass: authenticationData.pass
    }, (err, doc) => {
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
  sendQuestion(callback) {
    choosedResultList = [];
    choosedResults = [0, 0, 0, 0]

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
      deliveredData: {
        choosedResults: choosedResults,
        countResults: choosedResultList.length
      }
    });
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
          },
          'userID': {
            $first: '$userID'
          }

        }
      }
      ,
      {
        '$sort': {
          'sumPoint': 1,
          'sumTime': -1

        }
      }
    ], (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs[0].sumPoint);
        console.log(docs[1].sumPoint);
        console.log(docs[2].sumPoint);
        ChoosedResult.populate(docs, {
          'path': 'userID'
        }, (err, result) => {
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
    });
  }
  send8Ranking(callback) {
    callback({
      actionType: 'display8Ranking'
    });
  }

  send3Ranking(callback) {
    callback({
      actionType: 'display3Ranking'
    });
  }


  storeChooesedOption(storedData) {
    let spentTime = new Date() - startTime;
    storedData.spentTime = spentTime;
    choosedResultList.push(storedData);
    switch (storedData.choosedOption) {
      case '1':
        choosedResults[0] = choosedResults[0] + 1
        break;
      case '2':
        choosedResults[1] = choosedResults[1] + 1
        break;
      case '3':
        choosedResults[2] = choosedResults[2] + 1
        break;
      case '4':
        choosedResults[3] = choosedResults[3] + 1
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
