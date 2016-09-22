var colors = ['#2ad2c9', '#d0e100', '#384d54', '#3fc380', '#000066',
              '#02a388', '#2c001e', '#ffd400', '#ff8700', '#646464',
              '#6f1ab1', '#76b900', '#5b9a68', '#334858', '#decba5',
              '#026466', '#ff5454', '#282828', '#685bc7', '#25aff4'];

var roundState = true;                              // флаг состояния раунда
var tiles = { firstTile: null, secondTile: null };  // тайлы текущего раунда

var tilesAvailableStatus = true;                    // флаг обозначающий доступность тайлов к клику
var countToWin = 0;                                 // очки, которые нужно набрать что бы победить
var correctTilesCount = 0;                          // текущее колличество очков

makeGame(4);

function makeGame(mode) {
  var tilesAmount = mode * mode;
  countToWin = tilesAmount / 2;
  var usedIndexes = [];
  var $gameField = makeField(mode);
  $('body').append($gameField);

  getIndexes(usedIndexes, tilesAmount / 2);
  insertTiles(usedIndexes, $gameField);
}

function getIndexes(array, indexesAmount) {          // функция гененерирующая случайный набор индексов для тайлов
  var index;                                         // значение индекса зависит от размера массива с цветами
  var localIndexes = [];                             // а колличество идексов от общего количества тайлов

  while(localIndexes.length < indexesAmount) {
    index = Math.round(Math.random() * (colors.length - 1));

    if($.inArray(index, localIndexes) === -1) {
      localIndexes.push(index);
      array.push({'index': index, 'used': 0});
    }
  }
}

function insertTiles(indexes, $field) {              // функция производит вставку тайлов в игровую область
  var index;                                         // случайным образом
  var localIndexes = [];

  while(localIndexes.length < indexes.length) {
    index = Math.round(Math.random() * (indexes.length - 1));
    if($.inArray(index, localIndexes) !== -1) continue;

    indexes[index].used++;
    $field.append(makeTile(indexes[index].index));

    if(indexes[index].used == 2) {
      localIndexes.push(index);
    }
  }
}

function makeTile(index) {                           // функция создает DOM элемента тайла
  var $tile = $("<div class='tile available'></div>");
  $tile.attr("data-index", index).css("background-color", '#a1a1a4')
  .click(clickOnTile);
  return $tile;
}

function clickOnTile() {                            // обработчик события при нажатии на тайл
  if(!tilesAvailableStatus) return;
  $(this).css("background-color", colors[$(this).data('index')]);
  watchRound(this);
}

function makeField(mode) {                         // функция создает DOM элемент игорового поля
  var $field = $("<div id='gameField'></div>");
  $field.css("width", 50 * mode);
  return $field;
}

function watchRound(obj) {                        // функция обработки раунда
  if(roundState) {
    tiles.firstTile = obj;
    roundState = false;
  } else {
    var $objectsInRound = $(obj).add(tiles.firstTile);
    tilesAvailableStatus = false;

    if($(tiles.firstTile).data('index') === $(obj).data('index')) {
      correctTilesCount++;
      setTimeout(function() {
        $objectsInRound.css('visibility', 'hidden');
        tilesAvailableStatus = true;
      }, 1000);

      if(correctTilesCount == countToWin) {
        $('h1').css("display", "block");
      }
    } else {
      setTimeout(function() {
          $objectsInRound.css("background-color", '#a1a1a4');
          tilesAvailableStatus = true;
      }, 1000);
    }
    roundState = true;
  }
}
