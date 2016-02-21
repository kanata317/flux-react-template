import socketIO from 'socket.io-client'

$(document).ready(function() {
  function allHide() {
    $(".question").hide();
    $(".choosedResult").hide();
    $(".ranking").hide();
  }

  function deployQuestion(questionData) {
    allHide();
    $(".questionSentence").text(questionData.questionSentence);
    questionData.answerOptions.map(element => {
      $(".optionText" + element.number).text(element.answerSentence);
      let targetClass = '#optionDiv' + element.number;
      $(targetClass).removeClass('answerDiv');

    });
    $(".choosedOptions").hide();
    $(".optionCount").hide();
    $(".question").show();

  }

  function start() {
    $(".choosedOptions").show();
  }

  function end() {
    allHide();
  }

  function displayChoosedResults(choosedResultsData) {
    allHide();
    choosedResultsData.choosedResults.map((element, index) => {
      index = index + 1;
      $(".optionCount" + index).text(element + "人");
    });
    $(".question").show();
    $(".optionCount").show();
  }

  function displayAnswer(answerOption) {
    let targetClass = '#optionDiv' + answerOption.answerOption;
    setTimeout(() => {
      $(targetClass).addClass('answerDiv');
      setTimeout(() => {
        $(targetClass).removeClass('answerDiv')
        setTimeout(() => {
          $(targetClass).addClass('answerDiv')
          setTimeout(() => {
            $(targetClass).removeClass('answerDiv')
            setTimeout(() => {
              $(targetClass).addClass('answerDiv')
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);

  }

  function displayRanking(rankingList) {
    allHide();
    $(".ranking").empty();
    $(".ranking").show();
    rankingList.map((element, index) => {
      let rank = rankingList.length - index;
      let rankDiv = '<div class="rankDiv">'
        + '<span class="rank">' + rank + '</span>'
        + '<span class="userName">' + element.userID.displayedName + '</span>'
        + '<span class="point">' + element.sumPoint + 'ポイント</span>'
        + '<span class="time">' + element.sumTime / 1000 + '秒</span>'
        + '</div>'
      $(rankDiv).clone().hide().delay(index).prependTo($('.ranking')).slideDown();
    });


  }


  allHide();
  let socket = socketIO.connect(`${location.protocol}//${location.host}`);
  socket.on('connect', () => {
    console.info('connecting.....')
  });

  socket.on('server', recieveData => {
    console.log(recieveData.actionType);
    switch (recieveData.actionType) {
      case 'start':
        start();
        break;
      case 'end':
        end();
        break;
      case 'deployQuestion':
        deployQuestion(recieveData.deliveredData);
        break;
      case 'displayChoosedResults':
        displayChoosedResults(recieveData.deliveredData);
        break;
      case 'displayAnswer':
        displayAnswer(recieveData.deliveredData);
        break;
      case 'displayRanking':
        displayRanking(recieveData.deliveredData);
        break;



      default:

    }

  });





});