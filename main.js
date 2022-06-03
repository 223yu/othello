const stage = $('#stage');
const squareTemplate = $('#square-template');
const currentTurnText = $('#current-turn');
const stoneStateList = [];
let currentColor = 1;

// 初期配置
const createSquares = function(){
  for (let i=0; i<64; i++){
    const square = squareTemplate.clone(true);
    square.removeAttr('id');
    stage.append(square);

    const stone = square.children();

    let defaultState;
    if (i == 27 || i == 36){
      defaultState = 1;
    }else if(i == 28 || i == 35){
      defaultState = 2;
    }else{
      defaultState = 0;
    }

    stone.attr('data-state', defaultState);
    stone.attr('data-index', i);
    stoneStateList.push(defaultState);
  }
};

// 石を置けるかの判定
const getReversibleStones = function(idx){
  idx = Number(idx);
  // クリックしたマスから見て、各方向にマスがいくつあるかを計算
  const squareNums = [
    7 - (idx % 8), // 右方向
    Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8), // 右下方向
    (56 + (idx % 8) - idx) / 8, // 下方向
    Math.min(idx % 8, (56 + (idx % 8) - idx) / 8), // 左下方向
    idx % 8, // 左方向
    Math.min(idx % 8, (idx - (idx % 8)) / 8), // 左上方向
    (idx - (idx % 8)) / 8, // 上方向
    Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8), // 右上方向
  ];

  // for文ループ用のパラメータ
  const parameters = [1, 9, 8, 7, -1, -9, -8, -7];

  // 返せることが確定した石の情報を格納する配列
  let results = [];

  for (let i=0; i<8; i++){
    // 返せる可能性のある石の情報を格納する配列
    const temp = [];
    const squareNum = squareNums[i];
    const param = parameters[i];

    // 隣の石の状態
    const nextStoneState = stoneStateList[idx + param];

    // 隣に石がない、隣の石が自分の石の場合、次のループへ
    if (nextStoneState == 0 || nextStoneState == currentColor){
      continue;
    }else{
      temp.push(idx + param);
    }

    // 隣の石方向を調べる
    for (let j=0; j < squareNum - 1; j++){
      const targetIdx = idx + param * 2 + param * j;
      const targetColor = stoneStateList[targetIdx];

      // 隣に石がない場合、forを抜ける
      // 隣の石が自分の色の場合、仮ボックスの石を返せることが確定
      if (targetColor == 0){
        break;
      }else if(targetColor == currentColor){
        results = $.merge(results, temp);
        break;
      }else{
        temp.push(targetIdx);
      }
    }
  }

  return results;
}

// 相手のターンに変更
const changeTurn = function(){
  currentColor = 3 - currentColor;

  if(currentColor == 1){
    currentTurnText.text('黒');
  }else{
    currentTurnText.text('白');
  }
}

$(window).on('load', function(){
  createSquares();
});

// マスクリック時
$('.square').on('click', function(){
  const index = $(this).children().attr('data-index');
  const reversibleStones = getReversibleStones(index);

  if (stoneStateList[index] !== 0 || reversibleStones.length == 0){
    alert('ここには置けません');
    return;
  }

  // 選択したマスの石を変更
  stoneStateList[index] = currentColor;
  $(this).children().attr('data-state', currentColor);

  $.each(reversibleStones, function(index,value){
    stoneStateList[value] = currentColor;
    $(`[data-index=${value}]`).attr('data-state', currentColor);
  });

  // 相手のターンに変更
  changeTurn();

  // 盤面を数える
  const blackStoneNum = $.grep(stoneStateList, function(state){
    return (state == 1);
  }).length;
  const whiteStoneNum = $.grep(stoneStateList, function(state){
    return (state == 2);
  }).length;

  $('#black-count').text(blackStoneNum);
  $('#white-count').text(whiteStoneNum);

  // 盤面がいっぱいの場合、集計してゲームを終了
  if (blackStoneNum + whiteStoneNum == 64){

    let winnerText = '';
    if (blackStoneNum > whiteStoneNum){
      winnerText = '黒の勝ちです';
    }else if(blackStoneNum < whiteStoneNum){
      winnerText = '白の勝ちです';
    }else{
      winnerText = '引き分けです';
    }

    setTimeout(function(){alert(`ゲーム終了です。白${whiteStoneNum}、黒${blackStoneNum}で、${winnerText}`)}, 1);
  }
});

// パスボタンクリック時
$('#pass').on('click', function(){
  changeTurn();
});