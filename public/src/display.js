import socketIO from 'socket.io-client'

$(document).ready(function() {
  function allHide() {
    $(".question").hide();
    $(".choosedResult").hide();
    $(".ranking").hide();
  }

  let startMusic = new Audio('../music/start.mp3');
  let answerMusic = new Audio('../music/answer.mp3');
  let answerTimeMusic = new Audio('../music/answerTime.mp3');
  let statusMusic = new Audio('../music/status.mp3');
  let rankingMusic = new Audio('../music/ranking.mp3');
  let rankingResultMusic = new Audio('../music/rankingResult.mp3');
  let endMusic = new Audio('../music/end.mp3');

  let best8List = [];
  let best3List = [];



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
    startMusic.play();

  }

  function start() {
    $(".choosedOptions").show();
    answerTimeMusic.play();
  }

  function end() {
    answerTimeMusic.pause();
    answerTimeMusic.currentTime = 0;
    endMusic.play();
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
    statusMusic.play();
  }

  function displayAnswer(answerOption) {
    answerMusic.play();
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
    rankingMusic.loop = true;
    rankingMusic.play();
    rankingList.map((element, index) => {
      let rank = rankingList.length - index;
      if (rank < 2) {
        best3List.push(element);
      } else if (rank < 3) {
        best8List.push(element);
      }
      let rankDiv = '<div class="rankDiv">'
        + '<span class="rank">' + rank + '</span>'
        + '<span class="userName">' + element.userID.displayedName + '</span>'
        + '<span class="point">' + element.sumPoint + 'ポイント</span>'
        + '<span class="time">' + element.sumTime / 1000 + '秒</span>'
        + '</div>'
      $(rankDiv).clone().hide().delay(index).prependTo($('.ranking')).slideDown();
    });
    rankingMusic.pause();
    rankingMusic.currentTime = 0;
    rankingResultMusic.play();
  }
  function displayRankingBest(rankingList) {
    allHide();
    $(".ranking").empty();
    $(".ranking").show();
    rankingMusic.loop = true;
    rankingMusic.play();
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
    rankingMusic.pause();
    rankingMusic.currentTime = 0;
    rankingResultMusic.play();
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
      case 'display8Ranking':
        displayRankingBest(best8List);
        break;
      case 'display3Ranking':
        displayRankingBest(best3List);
        break;



      default:

    }

  });





});
