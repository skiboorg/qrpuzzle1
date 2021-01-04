


var image_rendering = 'pixelated'
if (typeof InstallTrigger !== 'undefined') // is Firefox
  image_rendering = 'optimizeSpeed'


// seconds

  // window.onload = () => {
  //   StartStop();
  // }


// объявляем переменные
// var base = 60;
// var clocktimer, dateObj, dh, dm, ds, ms;
// var readout = '';
// var h = 1,
//   m = 1,
//   tm = 1,
//   s = 0,
//   ts = 0,
//   ms = 0,
//   init = 0;

//функция для очистки поля
// function ClearСlock() {
//   clearTimeout(clocktimer);
//   h = 1;
//   m = 1;
//   tm = 1;
//   s = 0;
//   ts = 0;
//   ms = 0;
//   init = 0;
//   readout = '00:00:00';
//   document.MyForm.stopwatch.value = readout;
// }
//
// //функция для старта секундомера
// function StartTIME() {
//   var cdateObj = new Date();
//   var t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
//   if (t > 999) {
//     s;
//   }
//   if (s >= (m * base)) {
//     ts = 0;
//     m++;
//   } else {
//     ts = parseInt((ms / 100) + s);
//     if (ts >= base) {
//       ts = ts - ((m - 1) * base);
//     }
//   }
//   if (m > (h * base)) {
//     tm = 1;
//     h++;
//   } else {
//     tm = parseInt((ms / 100) + m);
//     if (tm >= base) {
//       tm = tm - ((h - 1) * base);
//     }
//   }
//   ms = Math.round(t / 10);
//   if (ms > 99) {
//     ms = 0;
//   }
//   if (ms == 0) {
//     ms = '00';
//   }
//   if (ms > 0 && ms <= 9) {
//     ms = '0' + ms;
//   }
//   if (ts > 0) {
//     ds = ts;
//     if (ts < 10) {
//       ds = '0' + ts;
//     }
//   } else {
//     ds = '00';
//   }
//   dm = tm - 1;
//   if (dm > 0) {
//     if (dm < 10) {
//       dm = '0' + dm;
//     }
//   } else {
//     dm = '00';
//   }
//   dh = h - 1;
//   if (dh > 0) {
//     if (dh < 10) {
//       dh = '0' + dh;
//     }
//   } else {
//     dh = '00';
//   }
//   readout = dm + ':' + ds;
//   //readout = dh + ':' + dm + ':' + ds;
//   document.MyForm.stopwatch.value = readout;
//   clocktimer = setTimeout("StartTIME()", 1);
// }
//
// //Функция запуска и остановки
// function StartStop() {
//   if (init == 0) {
//     ClearСlock();
//     dateObj = new Date();
//     StartTIME();
//     init = 1;
//   } else {
//     clearTimeout(clocktimer);
//     init = 0;
//   }
// }

/**
 * Created by Kirill_ on 21-Feb-2020.
 */


localStorage.clear()

function timeSet() {
    totalAmount--;
    // Refresh value in localStorage
    localStorage.setItem('countDown', totalAmount);

     // If countdown is over, then remove value from storage and clear timeout
     if (totalAmount < 0 ) {
         localStorage.removeItem('countDown');
         totalAmount = 0;
         concide();
         return;
     }

    var minutes = parseInt(totalAmount/60);
    var seconds = parseInt(totalAmount%60);


    if(minutes < 10)
        minutes = "0"+minutes;

    if(seconds < 10)
        seconds = "0"+seconds;

    $('#id_timer').text(minutes + ":" + seconds);

    timeloop = setTimeout(timeSet, 1000);
}

var jQuery = window.jQuery || require('jquery');

(function ($) {
  $.fn.puzzle = function (param) {
    console.log(this)
    var $this = $(this[0]);

    var puzzles = {};
    var selected_puzzle = false;
    var selected_group = false;
    var z_index = 2;
    var offsets = {};
    var inaccuracy = 15;
    var allPuzl;

    var image = new Image();
    image.onload = function () {


      var puzzle_quantity = getPuzzleQuantity(param.size * param.scale, image.naturalWidth * param.scale, image.naturalHeight * param.scale);

      // changed this to #game div (previous is puzzle-board)


      var this_offset = $('#game').offset();
      var this_width = $('#game').width();
      var this_height = $('#game').height();

      console.log('this_offset',this_offset)
      console.log('this_width',this_width)
      console.log('this_height',this_height)

      if (!this_height || !this_width) {
        var wnd = $(window);
        this_width = wnd.width();
        this_height = wnd.height()/3;
        console.log('this_height_wnd',this_height)
      }

      for (var i = 0; i < puzzle_quantity.segments; i++) {
        var puzzle = createPuzzle(image, i + 1, param.size*param.scale, param.scale); // needs to multiply param.size by param.scale

        puzzle.puzzleOffset({
          left: randomInteger(this_offset.left + 230, this_offset.left + 0.5 *this_width - param.size),
          top: randomInteger(this_offset.top, this_offset.top + 0.5*this_height - param.size)
        });

        puzzles[puzzle.prop('row') + 'X' + puzzle.prop('column')] = puzzle;

        move(puzzle);

        $this.append(puzzle);

      }
      // подготовка блоков к старту
      console.log('Puzzle quantity ' + i);
      $('#puzzle-board').css('display', 'block') // for showing board after concide
      $('.game_won_block > .message-box').css({'visibility':'hidden', 'display': 'none'})
      $('.complexity_btn').prop('disabled', false); // for 2 puzzles at time bug
      $("#id_concide").attr("disabled", false);

      allPuzl = i;

      // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

        $(window).on('touchmove mousemove' , puzzleMove);
        $(window).on('touchend mouseup' , puzzleEndMove);


      // }else{
      // $(window).mousemove(puzzleMove);
      // $(window).mouseup(puzzleEndMove);
      //  }


    };

    image.src = param.image;

    return this;

    /**
     * Add handler to puzzle start move.
     * @param puzzle
     */
    function move(puzzle) {

      var path = puzzle.find('.puzzle-border');

      puzzle.on('mousedown touchstart', function (event, params) {

        let pageX = event.pageX;
        let pageY = event.pageY;

        let touch = event.changedTouches ? event.changedTouches[0] : false;

        if(touch){
          pageX =  touch.pageX;
          pageY = touch.pageY;
        }


        // Отменяем событие по умолчанию
        if (event.stopPropagation)
          event.stopPropagation();
        event.cancelBubble = true;

        if (params) {
          event.clientX = params.clientX;
          event.clientY = params.clientY;
          event.pageX = params.pageX;
          event.pageY = params.pageY;
        }

        if ($(event.target).hasClass('puzzle-border') || (event.changedTouches && $(event.targetTouches[0]).hasClass('puzzle-border'))) {
          if (!puzzle.prop('hold')) {
            var puzzle_offset = puzzle.puzzleOffset();
            offsets.left = pageX - puzzle_offset.left;
            offsets.top = pageY - puzzle_offset.top;

            selected_puzzle = puzzle;
            puzzle.css('z-index', z_index++);
          }
          else {
            var puzzle_group = puzzle.parent();

            if (puzzle_group.hasClass('puzzle-group')) {

              var group_offset = puzzle_group.offset();

              offsets.left = pageX - group_offset.left;
              offsets.top = pageY - group_offset.top;

              selected_group = puzzle_group;
              selected_group.css('z-index', z_index++);
            }
          }
        }
        else {
          puzzle.css('display', 'none');

          var $new_target = getCurrentTarget(event);


          $new_target.trigger('mousedown', event);


          puzzle.css('display', 'block');
        }

        if(!touch){
        return false;
        }


      });

    }

    /**
     * Движение пазла
     * @param event
     * @returns {boolean}
     */


    function puzzleMove(event) {

            let pageX = event.pageX;
            let pageY = event.pageY;

            let touch = event.changedTouches ? event.changedTouches[0] : false;

            if(touch){
              pageX =  touch.pageX;
              pageY = touch.pageY;
            }
  // console.log('pageX=',pageX)
   //     console.log('pageY=',pageY)
      if (event.stopPropagation)
        event.stopPropagation();
      event.cancelBubble = true;



      if (selected_puzzle) {
        selected_puzzle.puzzleOffset({top: pageY - offsets.top, left: pageX - offsets.left});
      }

      if (selected_group) {
        selected_group.offset({top: pageY - offsets.top, left: pageX - offsets.left});
      }


      if(!touch){
        return false;
        }

    }

    /**
     * Закончить движение пазла
     * @param event
     */

    function puzzleEndMove(event) {

         let pageX = event.pageX;
         let pageY = event.pageY;

         let touch = event.changedTouches ? event.changedTouches[0] : false;

         if(touch){
           pageX =  touch.pageX;
           pageY = touch.pageY;
         }

      // Data needs to validate puzzle piece position.
      var game_board_offset = $('#game').offset();
      var game_board_width = $('#game').width();
      var game_board_height = $('#game').height();
      if (pageX < game_board_offset.left+20 || pageX > game_board_offset.left + game_board_width - 20
          || pageY < game_board_offset.top+20 || pageY >  game_board_offset.top + game_board_height - 20)
      {
        return null
      }

      var position_x,
        position_y,
        glued_puzzle;

      // Отпустили пазл
      if (selected_puzzle) {
        position_x = pageX - offsets.left;
        position_y = pageY - offsets.top;


        glued_puzzle = gluePuzzles(selected_puzzle, position_x, position_y);


        if (glued_puzzle) {
          unionPuzzle(selected_puzzle, glued_puzzle);
        }


        selected_puzzle = false;
      }

      // Отпустили группу пазлов
      if (selected_group) {
        selected_group.css('z-index', 3);

        selected_group.children().each(function (index, element) {

          var $puzzle = $(element);
          var offset = $puzzle.puzzleOffset();

          glued_puzzle = gluePuzzles($puzzle, offset.left, offset.top);
          if (glued_puzzle) {
            unionGroup(selected_group, glued_puzzle);
            return false;
          }

          return true;
        });

        selected_group = false;
      }
      var puzlEnded = $('.puzzle-group').eq(0).find('svg').length;

        // Пазл собран
        if(allPuzl == puzlEnded){
          //$('.text_before_end').text('Ура! пазл собран')
          clearTimeout(timeloop);
          document.getElementById('id_concide').classList.add('btnDisabled')
          $("#id_concide").attr("disabled", true)
          sessionStorage.setItem('is_win', 1); //set is_win to true if player win
          let level = sessionStorage.getItem('level');
          console.log('win')
            app.result_title = 'YOU WIN'
            app.result = true
                            app.result_image_modal = true
                            app.result_image = image_url
           $('.puzzle-group').remove() // for bug sometimes game not ended
          $('.img_end').remove() // remove concide image
          $('#concide_image').remove() // remove concide image div
          //$('.game_won_block > .message-box > .rate').text('+' + (level * 10) + '% to your balance')

          let body = {'game_id':app.current_game_id}
                    fetch('/game/win/', {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: { "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value  },
                        credentials: 'same-origin'
                    }).then(res=>res.json())
                        .then(res => {

                            console.log(res)
                           // document.getElementsByClassName('win-label')[0].classList.add('winLabelActive')
                            document.getElementById('rating_desktop').innerText = res['rating']

                        })

        }
    }

    /**
     * Объеденить группы пазлов
     * @param group
     * @param puzzle
     */
    function unionGroup(group, puzzle) {

      var old_offset;

      puzzle.prop('hold', true);

      var $puzzle_group = puzzle.parent();
      if ($puzzle_group.hasClass('puzzle-group')) {
        $puzzle_group.children().each(function (index, element) {

          var $puzzle = $(element);


          old_offset = $puzzle.puzzleOffset();
          group.append($puzzle);
          $puzzle.puzzleOffset(old_offset);
        });
        $puzzle_group.remove();
      }
      else {
        old_offset = puzzle.puzzleOffset();
        group.append(puzzle);
        puzzle.puzzleOffset(old_offset);
      }

    }

    /**
     * Объеденить пазлы в группу
     * @param puzzle1
     * @param puzzle2
     */
    function unionPuzzle(puzzle1, puzzle2) {


      puzzle1.prop('hold', true);
      puzzle2.prop('hold', true);

      var $puzzle_group = $('<div class="puzzle-group" style="position:absolute""></div>');
      puzzle1.parent().append($puzzle_group);


      // Определяем с группой соеденяем или с одним пазлом
      var $puzzle_group_second = puzzle2.parent();
      if ($puzzle_group_second.hasClass('puzzle-group')) {
        var old_offset = $puzzle_group_second.offset();
        var puzzle1_offset = puzzle1.puzzleOffset();


        $puzzle_group.offset({left: old_offset.left, top: old_offset.top});

        var puzzles = $puzzle_group_second.children();
        $puzzle_group.append(puzzle1, puzzles);

        puzzle1.puzzleOffset({
          top: puzzle1_offset.top,
          left: puzzle1_offset.left
        });


        $puzzle_group_second.remove();
      }
      else {
        $puzzle_group.append(puzzle1, puzzle2);
      }
    }

    /**
     * Склеить пазы если есть радом, вернет приклееный пазл
     * @param puzzle
     * @param x
     * @param y
     * @returns {*}
     */
    function gluePuzzles(puzzle, x, y) {

      var offset,
        $parent = puzzle.parent(),
        is_group = $parent.hasClass('puzzle-group');

      var row = puzzle.prop('row');
      var column = puzzle.prop('column');
      var size = puzzle.prop('size');

      var puzzle_offset = puzzle.puzzleOffset();
      x = puzzle_offset.left;
      y = puzzle_offset.top;

      if (puzzle && x && y) {
        // TOP PUZZLE
        var top_puzzle = puzzles[(row - 1) + 'X' + column];
        if (top_puzzle) {$('.img_end').remove()
          offset = top_puzzle.puzzleOffset();

          if (offset.left - inaccuracy < x && offset.left + inaccuracy > x
            && offset.top + size - inaccuracy < y
            && offset.top + size + inaccuracy > y) {

            if (!is_group || (is_group && $parent.get(0) !== top_puzzle.parent().get(0))) {
              if (is_group) {
                puzzle.puzzleOffset({left: offset.left, top: offset.top + size}, true);
              }
              else {
                puzzle.puzzleOffset({left: offset.left, top: offset.top + size});
              }
              return top_puzzle;
            }
          }
        }

        // RIGHT PUZZLE
        var right_puzzle = puzzles[row + 'X' + (column + 1)];
        if (right_puzzle) {
          offset = right_puzzle.puzzleOffset();

          if (offset.left - size - inaccuracy < x && offset.left - size + inaccuracy > x
            && offset.top - inaccuracy < y && offset.top + inaccuracy > y) {
            if (!is_group || (is_group && $parent.get(0) !== right_puzzle.parent().get(0))) {
              if (is_group) {
                puzzle.puzzleOffset({left: offset.left - size, top: offset.top}, true);
              }
              else {
                puzzle.puzzleOffset({left: offset.left - size, top: offset.top});
              }
              return right_puzzle;
            }
          }
        }

        // BOTTOM PUZZLE
        var bottom_puzzle = puzzles[(row + 1) + 'X' + column];
        if (bottom_puzzle) {
          offset = bottom_puzzle.puzzleOffset();

          if (offset.left - inaccuracy < x && offset.left + inaccuracy > x
            && offset.top - size - inaccuracy < y && offset.top - size + inaccuracy > y) {
            if (!is_group || (is_group && $parent.get(0) !== bottom_puzzle.parent().get(0))) {
              if (is_group) {
                puzzle.puzzleOffset({left: offset.left, top: offset.top - size}, true);
              }
              else {
                puzzle.puzzleOffset({left: offset.left, top: offset.top - size});
              }
              return bottom_puzzle;
            }


          }
        }

        // LEFT PUZZLE
        var left_puzzle = puzzles[row + 'X' + (column - 1)];
        if (left_puzzle) {
          offset = left_puzzle.puzzleOffset();

          if (offset.left + size - inaccuracy < x && offset.left + size + inaccuracy > x
            && offset.top - inaccuracy < y && offset.top + inaccuracy > y) {

            if (!is_group || (is_group && $parent.get(0) !== left_puzzle.parent().get(0))) {
              if (is_group) {
                puzzle.puzzleOffset({left: offset.left + size, top: offset.top}, true);
              }
              else {
                puzzle.puzzleOffset({left: offset.left + size, top: offset.top});
              }
              return left_puzzle;
            }

          }
        }
      }


    }

    /**
     * Получить элемент по координатам
     * @param event
     * @returns {*}
     */
    function getCurrentTarget(event) {


   //
   let pageX = event.pageX;
   let pageY = event.pageY;

   let touch = event.changedTouches ? event.changedTouches[0] : false;

   if(touch){
     pageX =  touch.pageX;
     pageY = touch.pageY;
   }



      var hoverElem;
      if (navigator.userAgent.match('MSIE') || navigator.userAgent.match('Gecko')) {
        if(touch){
          hoverElem = document.elementFromPoint(touch.clientX, touch.clientY);
        }else{
          if(event.clientX){
          hoverElem = document.elementFromPoint(event.clientX, event.clientY);
          }
        }
      }
      else {
        hoverElem = document.elementFromPoint(pageX, pageY);
      }

      return $(hoverElem);
    }

    /**
     * Полу
      quantity.columns = Math.floor(width / 2);
      quantity.rows = Math.floor(height / 2);чить количество пазлов
     * @param side_width
     * @param width
     * @param height
     * @returns {{}}
     */
    function getPuzzleQuantity(side_width, width, height) {

      var quantity = {};
      quantity.columns = Math.floor(width / side_width);
      quantity.rows = Math.floor(height / side_width);
      quantity.width = quantity.columns * side_width;
      quantity.height = quantity.rows * side_width;
      quantity.segments = quantity.columns * quantity.rows;
      quantity.size = side_width;
      return quantity;

    }

    /**
     * Возвращает случайное число в звдвнных пределах
     * @param min
     * @param max
     * @returns {*}
     */
    function randomInteger(min, max) {
      // var rand = min + Math.random() * (max - min);
      // rand = Math.round(rand);
      return Math.floor((Math.random() * max) + min);
    }

    /**
     * Создает NODE объект пазла
     */
    function createPuzzle(image, puzzle_number, puzzle_size, scale) {

      if (!scale)
        scale = 1;

      var puzzle_quantity = getPuzzleQuantity(puzzle_size, image.naturalWidth * scale, image.naturalHeight * scale);
      var image_scale = scale * (150 / puzzle_size);
      var border_size = 50 * (puzzle_size / 150);

      var position = {};
      position.isFirst = puzzle_number == 1;
      position.isLast = puzzle_number == puzzle_quantity.segments;
      position.row = Math.floor((puzzle_number - 1) / (puzzle_quantity.columns)) + 1;
      position.column = puzzle_number - (position.row - 1) * puzzle_quantity.columns;

      var border = getBorder(puzzle_quantity, position);


      // Create svg
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" ' +
        'width="' + (puzzle_size + border_size * 2) + 'px" height="' + (puzzle_size + border_size * 2) + 'px" version="1.1"' +
        'class="puzzle" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 250 250">' +

        '<clipPath id="path' + puzzle_number + '">' +
        '<path d="' + border.top + border.right + border.bottom + border.left + '"></path>' +
        '</clipPath>' +
        '<g stroke="black" stroke-width="0">' +
        '<g style="clip-path:url(#path' + puzzle_number + ')">' +
        '<image xlink:href="' + image.src + '" x="' + (50 - (position.column - 1) * 150) +
        '" y="' + (50 - (position.row - 1) * 150) +
        '" width="' + image.naturalWidth * image_scale + '" height="' + image.naturalHeight * image_scale + '"></image>' +
        '</g>' +
        '<path class="puzzle-border" fill="transparent" d="' + border.top + border.right + border.bottom + border.left + '"></path>' +
        '</g>' +
        '</svg>';

      var $svg = $(svg);
      //$svg.attr('data-top',puzzle_number)

      $svg.css({
        'z-index': 1,
        'shape-rendering': 'optimizeSpeed',
        'image-rendering': image_rendering,
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        'position': 'absolute',
        'cursor': 'pointer'
      });
      $svg.prop('column', position.column);
      $svg.prop('row', position.row);
      $svg.prop('size', puzzle_size);
      $svg.prop('hold', false);
      $svg.prop('puzzle_border_size', border_size);

      return $svg;
    }

    /**
     * Получить нужный border
     * @param puzzle_quantity
     * @param position
     * @returns {{}}
     */
    function getBorder(puzzle_quantity, position) {

      var b = {
        top: {
          smooth: 'M50,50',
          outside: 'M50,50',
          inside: 'M50,50'
        },
        right: {
          smooth: ' L200,50',
          outside: ' L200,50',
          inside: ' L200,50'
        },
        bottom: {
          smooth: ' L200,200',
          outside: ' L200,200',
          inside: ' L200,200'
        },
        left: {
          smooth: ' L50,200z',
          outside: ' L50,200',
          inside: ' L50,200'
        }
      };
      var border = {};

      // TOP
      if (position.row == 1)
        border.top = b.top.smooth;
      else {
        if (puzzle_quantity.columns % 2 == 0) {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.top = b.top.outside;
          }
          else {
            border.top = b.top.inside;
          }
        }
        else {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.top = b.top.outside;
          }
          else {
            border.top = b.top.inside;
          }
        }
      }

      // RIGHT
      if (position.column == puzzle_quantity.columns)
        border.right = b.right.smooth;
      else {
        if (puzzle_quantity.columns % 2 == 0) {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.right = b.right.inside;
          }
          else {
            border.right = b.right.outside;
          }
        }
        else {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.right = b.right.inside;
          }
          else {
            border.right = b.right.outside;
          }
        }
      }

      // BOTTOM
      if (position.row == puzzle_quantity.rows)
        border.bottom = b.bottom.smooth;
      else {
        if (puzzle_quantity.columns % 2 == 0) {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.bottom = b.bottom.outside;
          }
          else {
            border.bottom = b.bottom.inside;
          }
        }
        else {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.bottom = b.bottom.outside;
          }
          else {
            border.bottom = b.bottom.inside;
          }
        }
      }

      // LEFT
      if (position.column == 1)
        border.left = b.left.smooth;
      else {
        if (puzzle_quantity.columns % 2 == 0) {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.left = b.left.inside;
          }
          else {
            border.left = b.left.outside;
          }
        }
        else {
          if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
            border.left = b.left.inside;
          }
          else {
            border.left = b.left.outside;
          }
        }
      }


      return border;

    }

  };
  $.fn.puzzleOffset = function (position, set_parent) {

    if (this.prop('puzzle_border_size')) {
      if (position == undefined) {
        var offset = this.offset();
        return {
          top: offset.top + this.prop('puzzle_border_size'),
          left: offset.left + this.prop('puzzle_border_size')
        };
      }
      else {
        var $group = this.parent();

        if (set_parent) {
          var old_puzzle_offset = this.puzzleOffset();
          var old_group_offset = $group.offset();

          $group.offset({
            left: old_group_offset.left - (old_puzzle_offset.left - position.left),
            top: old_group_offset.top - (old_puzzle_offset.top - position.top)
          });

        }
        else {
          this.offset({
            top: (position.top - this.prop('puzzle_border_size')),
            left: position.left - this.prop('puzzle_border_size')
          });
        }
      }
    }

  }
})(jQuery);

function concide() {
  console.log('ccc')
  $("#id_concide").attr("disabled", true);
  if (typeof timeloop !== 'undefined') {
    $('.img_end').remove()
    if (timeloop)
      clearTimeout(timeloop)
    //document.getElementsByClassName('lose-label')[0].classList.add('loseLabelActive')
      document.getElementById('id_concide').classList.add('btnDisabled')
    app.result_title = 'YOU LOSE'
      app.result=false
    app.result_image_modal = true
    app.result_image = image_url
      $('#puzzle-board svg').remove()

   // $('#result_img').html('<div id="concide_image" style="margin:auto"><img class="img_end" src="' + image_url + '"></div>')
   // document.getElementById('puzzle-board').style.display='none'
    // $('#puzzle-board').fadeOut(function(){
    //     document.getElementsByClassName('lose-label')[0].classList.toggle('loseLabelActive')
    //
    //     // $('.lose').fadeIn();
    //     let size = sessionStorage.getItem('puzzle_size')
    //     // $('#result_img').html('<div id="concide_image" style="margin:auto"><img class="img_end" src="' + image_url + '"></div>')
    // })
  }
}

$(function(){
  $('.fullscreen').on('click touch', function(){
    $('#logo').fadeOut()
    $('#header').fadeOut()
    $('#game-start').fadeOut()
    $('#game').fadeOut()
    $('#modals').fadeOut()
    $('#game-control').fadeOut()

    $('#game').css('grid-area', '1 / 6 / 6 / 1')
    $('#game').fadeIn()
    $('#game *').fadeIn()
  })
  $('.theme').on('click touch', function(){
    $(this).toggleClass('actvs')

    if($(this).hasClass('actvs')){
        $('#game').css('background', 'rgb(220,220,220)')
      }else{
        $('#game').css('background', '#1a3553')
      }

  })


$(document).keydown(function(e) {
    if( e.keyCode === 27 ) {
        $('#logo').fadeIn()
        $('#header').fadeIn()
        $('#game-start').fadeIn()
        $('#game').fadeIn()
        $('#modals').fadeIn()
        $('#game-control').fadeIn()
        $('#game').css('grid-area', '2 / 2 / 3 / 4')

        return false;
    }
});

})

// function getDevice() {
//   if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//     return 'mobile';
//    }
//    return 'desktop';
// }


// var image_rendering = 'pixelated'
// if (typeof InstallTrigger !== 'undefined') // is Firefox
//   image_rendering = 'optimizeSpeed'
//
//
// // seconds
//
//   // window.onload = () => {
//   //   StartStop();
//   // }
//
//
// // объявляем переменные
// // var base = 60;
// // var clocktimer, dateObj, dh, dm, ds, ms;
// // var readout = '';
// // var h = 1,
// //   m = 1,
// //   tm = 1,
// //   s = 0,
// //   ts = 0,
// //   ms = 0,
// //   init = 0;
//
// //функция для очистки поля
// // function ClearСlock() {
// //   clearTimeout(clocktimer);
// //   h = 1;
// //   m = 1;
// //   tm = 1;
// //   s = 0;
// //   ts = 0;
// //   ms = 0;
// //   init = 0;
// //   readout = '00:00:00';
// //   document.MyForm.stopwatch.value = readout;
// // }
// //
// // //функция для старта секундомера
// // function StartTIME() {
// //   var cdateObj = new Date();
// //   var t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
// //   if (t > 999) {
// //     s;
// //   }
// //   if (s >= (m * base)) {
// //     ts = 0;
// //     m++;
// //   } else {
// //     ts = parseInt((ms / 100) + s);
// //     if (ts >= base) {
// //       ts = ts - ((m - 1) * base);
// //     }
// //   }
// //   if (m > (h * base)) {
// //     tm = 1;
// //     h++;
// //   } else {
// //     tm = parseInt((ms / 100) + m);
// //     if (tm >= base) {
// //       tm = tm - ((h - 1) * base);
// //     }
// //   }
// //   ms = Math.round(t / 10);
// //   if (ms > 99) {
// //     ms = 0;
// //   }
// //   if (ms == 0) {
// //     ms = '00';
// //   }
// //   if (ms > 0 && ms <= 9) {
// //     ms = '0' + ms;
// //   }
// //   if (ts > 0) {
// //     ds = ts;
// //     if (ts < 10) {
// //       ds = '0' + ts;
// //     }
// //   } else {
// //     ds = '00';
// //   }
// //   dm = tm - 1;
// //   if (dm > 0) {
// //     if (dm < 10) {
// //       dm = '0' + dm;
// //     }
// //   } else {
// //     dm = '00';
// //   }
// //   dh = h - 1;
// //   if (dh > 0) {
// //     if (dh < 10) {
// //       dh = '0' + dh;
// //     }
// //   } else {
// //     dh = '00';
// //   }
// //   readout = dm + ':' + ds;
// //   //readout = dh + ':' + dm + ':' + ds;
// //   document.MyForm.stopwatch.value = readout;
// //   clocktimer = setTimeout("StartTIME()", 1);
// // }
// //
// // //Функция запуска и остановки
// // function StartStop() {
// //   if (init == 0) {
// //     ClearСlock();
// //     dateObj = new Date();
// //     StartTIME();
// //     init = 1;
// //   } else {
// //     clearTimeout(clocktimer);
// //     init = 0;
// //   }
// // }
//
// /**
//  * Created by Kirill_ on 21-Feb-2020.
//  */
//
//
// localStorage.clear()
// function timeSet() {
//     totalAmount--;
//     // Refresh value in localStorage
//     localStorage.setItem('countDown', totalAmount);
//
//      // If countdown is over, then remove value from storage and clear timeout
//      if (totalAmount < 0 ) {
//          localStorage.removeItem('countDown');
//          totalAmount = 0;
//          concide();
//          return;
//      }
//
//     var minutes = parseInt(totalAmount/60);
//     var seconds = parseInt(totalAmount%60);
//
//
//     if(minutes < 10)
//         minutes = "0"+minutes;
//
//     if(seconds < 10)
//         seconds = "0"+seconds;
//
//     $('#id_timer').val(minutes + ":" + seconds);
//
//     timeloop = setTimeout(timeSet, 1000);
// }
//
// var jQuery = window.jQuery || require('jquery');
// (function ($) {
//   $.fn.puzzle = function (param) {
//
//     var $this = $(this[0]);
//
//     var puzzles = {};
//     var selected_puzzle = false;
//     var selected_group = false;
//     var z_index = 2;
//     var offsets = {};
//     var inaccuracy = 15;
//     var allPuzl;
//
//     var image = new Image();
//     image.onload = function () {
//
//
//       var puzzle_quantity = getPuzzleQuantity(param.size * param.scale, image.naturalWidth * param.scale, image.naturalHeight * param.scale);
//
//       // changed this to #game div (previous is puzzle-board)
//
//
//       var this_offset = $('#game').offset();
//       var this_width = $('#game').width();
//       var this_height = $('#game').height();
//
//
//       if (!this_height || !this_width) {
//         var wnd = $(window);
//         this_width = wnd.width();
//         this_height = wnd.height();
//       }
//
//       for (var i = 0; i < puzzle_quantity.segments; i++) {
//         var puzzle = createPuzzle(image, i + 1, param.size*param.scale, param.scale); // needs to multiply param.size by param.scale
//
//         puzzle.puzzleOffset({
//           left: randomInteger(this_offset.left, this_offset.left + 0.5*this_width - param.size),
//           top: randomInteger(this_offset.top, this_offset.top + 0.5*this_height - param.size)
//         });
//
//         puzzles[puzzle.prop('row') + 'X' + puzzle.prop('column')] = puzzle;
//
//         move(puzzle);
//
//         $this.append(puzzle);
//
//       }
//
//       console.log('Puzzle quantity ' + i);
//       $('#puzzle-board').css('display', 'block') // for showing board after concide
//       $('.game_won_block > .message-box').css({'visibility':'hidden', 'display': 'none'})
//       $('.complexity_btn').prop('disabled', false); // for 2 puzzles at time bug
//       $("#id_concide").attr("disabled", false);
//
//       allPuzl = i;
//
//      // $(window).mousemove(puzzleMove);
//        $(window).on('ontouchstart',function(e){
//
//           puzzleMove()
//           });
//       //$(window).touchend();
//      // document.ontouchend(puzzleEndMove);
//       $(window).on('ontouchend',function(e){
//
//           puzzleEndMove()
//           });
//
//     };
//     image.src = param.image;
//
//     return this;
//
//     /**
//      * Add handler to puzzle start move.
//      * @param puzzle
//      */
//     function move(puzzle) {
//       console.log(puzzle)
//       var path = puzzle.find('.puzzle-border');
//
//       puzzle.on('touchstart ', function (event, params) {
//         console.log(event)
//         console.log(event.targetTouches[0].clientX)
//
//         // Отменяем событие по умолчанию
//         if (event.stopPropagation)
//           event.stopPropagation();
//         event.cancelBubble = true;
//
//         if (params) {
//           event.targetTouches[0].clientX = params.targetTouches[0].clientX;
//           event.targetTouches[0].clientY = params.targetTouches[0].clientY;
//           event.targetTouches[0].pageX = params.targetTouches[0].pageX;
//           event.targetTouches[0].pageY = params.targetTouches[0].pageY;
//         }
//
//         if ($(event.target).hasClass('puzzle-border')) {
//           if (!puzzle.prop('hold')) {
//             var puzzle_offset = puzzle.puzzleOffset();
//             offsets.left = event.targetTouches[0].pageX - puzzle_offset.left;
//             offsets.top = event.targetTouches[0].pageY - puzzle_offset.top;
//
//             selected_puzzle = puzzle;
//             puzzle.css('z-index', z_index++);
//           }
//           else {
//             var puzzle_group = puzzle.parent();
//
//             if (puzzle_group.hasClass('puzzle-group')) {
//
//               var group_offset = puzzle_group.offset();
//
//               offsets.left = event.targetTouches[0].pageX - group_offset.left;
//               offsets.top = event.targetTouches[0].pageY - group_offset.top;
//
//               selected_group = puzzle_group;
//               selected_group.css('z-index', z_index++);
//             }
//           }
//         }
//         else {
//           //puzzle.css('display', 'none');
//
//           var $new_target = getCurrentTarget(event);
//           $new_target.trigger('touchstart', event);
//           puzzle.css('display', 'block');
//         }
//
//
//         return false;
//       });
//
//     }
//
//     /**
//      * Движение пазла
//      * @param event
//      * @returns {boolean}
//      */
//
//
//     function puzzleMove(event) {
//
//
//       if (event.stopPropagation)
//         event.stopPropagation();
//       event.cancelBubble = true;
//
//       if (selected_puzzle) {
//         selected_puzzle.puzzleOffset({top: event.targetTouches[0].pageY - offsets.top, left: event.targetTouches[0].pageX - offsets.left});
//       }
//
//       if (selected_group) {
//         selected_group.offset({top: event.targetTouches[0].pageY - offsets.top, left: event.targetTouches[0].pageX - offsets.left});
//       }
//
//       return false;
//     }
//
//     /**
//      * Закончить движение пазла
//      * @param event
//      */
//
//     function puzzleEndMove(event) {
//
//       // Data needs to validate puzzle piece position.
//       var game_board_offset = $('#game').offset();
//       var game_board_width = $('#game').width();
//       var game_board_height = $('#game').height();
//       if (event.pageX < game_board_offset.left+20 || event.pageX > game_board_offset.left + game_board_width - 20
//           || event.pageY < game_board_offset.top+20 || event.pageY >  game_board_offset.top + game_board_height - 20)
//       {
//         return null
//       }
//
//       var position_x,
//         position_y,
//         glued_puzzle;
//
//       // Отпустили пазл
//       if (selected_puzzle) {
//         position_x = event.pageX - offsets.left;
//         position_y = event.pageY - offsets.top;
//
//
//         glued_puzzle = gluePuzzles(selected_puzzle, position_x, position_y);
//
//
//         if (glued_puzzle) {
//           unionPuzzle(selected_puzzle, glued_puzzle);
//         }
//
//
//         selected_puzzle = false;
//       }
//
//       // Отпустили группу пазлов
//       if (selected_group) {
//         selected_group.css('z-index', 0);
//
//         selected_group.children().each(function (index, element) {
//
//           var $puzzle = $(element);
//           var offset = $puzzle.puzzleOffset();
//
//           glued_puzzle = gluePuzzles($puzzle, offset.left, offset.top);
//           if (glued_puzzle) {
//             unionGroup(selected_group, glued_puzzle);
//             return false;
//           }
//
//           return true;
//         });
//
//         selected_group = false;
//       }
//       var puzlEnded = $('.puzzle-group').eq(0).find('svg').length;
//
//         // Пазл собран
//         if(allPuzl == puzlEnded){
//           //$('.text_before_end').text('Ура! пазл собран')
//           clearTimeout(timeloop);
//           $("#id_concide").attr("disabled", true)
//           sessionStorage.setItem('is_win', 1); //set is_win to true if player win
//           let level = sessionStorage.getItem('level');
//           $('.game_won_block > .message-box > .rate').text('+' + (level * 10) + '% to your balance')
//           $('.game_won_block > .message-box').css({'visibility':'visible', 'display': 'flex',  'opacity': '1'})
//
//         }
//     }
//
//     /**
//      * Объеденить группы пазлов
//      * @param group
//      * @param puzzle
//      */
//     function unionGroup(group, puzzle) {
//
//       var old_offset;
//
//       puzzle.prop('hold', true);
//
//       var $puzzle_group = puzzle.parent();
//       if ($puzzle_group.hasClass('puzzle-group')) {
//         $puzzle_group.children().each(function (index, element) {
//
//           var $puzzle = $(element);
//
//
//           old_offset = $puzzle.puzzleOffset();
//           group.append($puzzle);
//           $puzzle.puzzleOffset(old_offset);
//         });
//         $puzzle_group.remove();
//       }
//       else {
//         old_offset = puzzle.puzzleOffset();
//         group.append(puzzle);
//         puzzle.puzzleOffset(old_offset);
//       }
//
//     }
//
//     /**
//      * Объеденить пазлы в группу
//      * @param puzzle1
//      * @param puzzle2
//      */
//     function unionPuzzle(puzzle1, puzzle2) {
//
//
//       puzzle1.prop('hold', true);
//       puzzle2.prop('hold', true);
//
//       var $puzzle_group = $('<div class="puzzle-group" style="position:absolute""></div>');
//       puzzle1.parent().append($puzzle_group);
//
//
//       // Определяем с группой соеденяем или с одним пазлом
//       var $puzzle_group_second = puzzle2.parent();
//       if ($puzzle_group_second.hasClass('puzzle-group')) {
//         var old_offset = $puzzle_group_second.offset();
//         var puzzle1_offset = puzzle1.puzzleOffset();
//
//
//         $puzzle_group.offset({left: old_offset.left, top: old_offset.top});
//
//         var puzzles = $puzzle_group_second.children();
//         $puzzle_group.append(puzzle1, puzzles);
//
//         puzzle1.puzzleOffset({
//           top: puzzle1_offset.top,
//           left: puzzle1_offset.left
//         });
//
//
//         $puzzle_group_second.remove();
//       }
//       else {
//         $puzzle_group.append(puzzle1, puzzle2);
//       }
//     }
//
//     /**
//      * Склеить пазы если есть радом, вернет приклееный пазл
//      * @param puzzle
//      * @param x
//      * @param y
//      * @returns {*}
//      */
//     function gluePuzzles(puzzle, x, y) {
//
//       var offset,
//         $parent = puzzle.parent(),
//         is_group = $parent.hasClass('puzzle-group');
//
//       var row = puzzle.prop('row');
//       var column = puzzle.prop('column');
//       var size = puzzle.prop('size');
//
//       var puzzle_offset = puzzle.puzzleOffset();
//       x = puzzle_offset.left;
//       y = puzzle_offset.top;
//
//       if (puzzle && x && y) {
//         // TOP PUZZLE
//         var top_puzzle = puzzles[(row - 1) + 'X' + column];
//         if (top_puzzle) {$('.img_end').remove()
//           offset = top_puzzle.puzzleOffset();
//
//           if (offset.left - inaccuracy < x && offset.left + inaccuracy > x
//             && offset.top + size - inaccuracy < y
//             && offset.top + size + inaccuracy > y) {
//
//             if (!is_group || (is_group && $parent.get(0) !== top_puzzle.parent().get(0))) {
//               if (is_group) {
//                 puzzle.puzzleOffset({left: offset.left, top: offset.top + size}, true);
//               }
//               else {
//                 puzzle.puzzleOffset({left: offset.left, top: offset.top + size});
//               }
//               return top_puzzle;
//             }
//           }
//         }
//
//         // RIGHT PUZZLE
//         var right_puzzle = puzzles[row + 'X' + (column + 1)];
//         if (right_puzzle) {
//           offset = right_puzzle.puzzleOffset();
//
//           if (offset.left - size - inaccuracy < x && offset.left - size + inaccuracy > x
//             && offset.top - inaccuracy < y && offset.top + inaccuracy > y) {
//             if (!is_group || (is_group && $parent.get(0) !== right_puzzle.parent().get(0))) {
//               if (is_group) {
//                 puzzle.puzzleOffset({left: offset.left - size, top: offset.top}, true);
//               }
//               else {
//                 puzzle.puzzleOffset({left: offset.left - size, top: offset.top});
//               }
//               return right_puzzle;
//             }
//           }
//         }
//
//         // BOTTOM PUZZLE
//         var bottom_puzzle = puzzles[(row + 1) + 'X' + column];
//         if (bottom_puzzle) {
//           offset = bottom_puzzle.puzzleOffset();
//
//           if (offset.left - inaccuracy < x && offset.left + inaccuracy > x
//             && offset.top - size - inaccuracy < y && offset.top - size + inaccuracy > y) {
//             if (!is_group || (is_group && $parent.get(0) !== bottom_puzzle.parent().get(0))) {
//               if (is_group) {
//                 puzzle.puzzleOffset({left: offset.left, top: offset.top - size}, true);
//               }
//               else {
//                 puzzle.puzzleOffset({left: offset.left, top: offset.top - size});
//               }
//               return bottom_puzzle;
//             }
//
//
//           }
//         }
//
//         // LEFT PUZZLE
//         var left_puzzle = puzzles[row + 'X' + (column - 1)];
//         if (left_puzzle) {
//           offset = left_puzzle.puzzleOffset();
//
//           if (offset.left + size - inaccuracy < x && offset.left + size + inaccuracy > x
//             && offset.top - inaccuracy < y && offset.top + inaccuracy > y) {
//
//             if (!is_group || (is_group && $parent.get(0) !== left_puzzle.parent().get(0))) {
//               if (is_group) {
//                 puzzle.puzzleOffset({left: offset.left + size, top: offset.top}, true);
//               }
//               else {
//                 puzzle.puzzleOffset({left: offset.left + size, top: offset.top});
//               }
//               return left_puzzle;
//             }
//
//           }
//         }
//       }
//
//
//     }
//
//     /**
//      * Получить элемент по координатам
//      * @param event
//      * @returns {*}
//      */
//     function getCurrentTarget(event) {
//
//       var hoverElem;
//       console.log(event)
//       if (navigator.userAgent.match('MSIE') || navigator.userAgent.match('Gecko')) {
//         hoverElem = document.elementFromPoint(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
//       }
//       else {
//         hoverElem = document.elementFromPoint(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
//       }
//       console.log(hoverElem)
//       return $(hoverElem);
//     }
//
//     /**
//      * Полу
//       quantity.columns = Math.floor(width / 2);
//       quantity.rows = Math.floor(height / 2);чить количество пазлов
//      * @param side_width
//      * @param width
//      * @param height
//      * @returns {{}}
//      */
//     function getPuzzleQuantity(side_width, width, height) {
//
//       var quantity = {};
//       quantity.columns = Math.floor(width / side_width);
//       quantity.rows = Math.floor(height / side_width);
//       quantity.width = quantity.columns * side_width;
//       quantity.height = quantity.rows * side_width;
//       quantity.segments = quantity.columns * quantity.rows;
//       quantity.size = side_width;
//       return quantity;
//
//     }
//
//     /**
//      * Возвращает случайное число в звдвнных пределах
//      * @param min
//      * @param max
//      * @returns {*}
//      */
//     function randomInteger(min, max) {
//       // var rand = min + Math.random() * (max - min);
//       // rand = Math.round(rand);
//       return Math.floor((Math.random() * max) + min);
//     }
//
//     /**
//      * Создает NODE объект пазла
//      */
//     function createPuzzle(image, puzzle_number, puzzle_size, scale) {
//
//       if (!scale)
//         scale = 1;
//
//       var puzzle_quantity = getPuzzleQuantity(puzzle_size, image.naturalWidth * scale, image.naturalHeight * scale);
//       var image_scale = scale * (150 / puzzle_size);
//       var border_size = 50 * (puzzle_size / 150);
//
//       var position = {};
//       position.isFirst = puzzle_number == 1;
//       position.isLast = puzzle_number == puzzle_quantity.segments;
//       position.row = Math.floor((puzzle_number - 1) / (puzzle_quantity.columns)) + 1;
//       position.column = puzzle_number - (position.row - 1) * puzzle_quantity.columns;
//
//       var border = getBorder(puzzle_quantity, position);
//
//
//       // Create svg
//       var svg =
//         '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" ' +
//         'width="' + (puzzle_size + border_size * 2) + 'px" height="' + (puzzle_size + border_size * 2) + 'px" version="1.1"' +
//         'class="puzzle" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 250 250">' +
//
//         '<clipPath id="path' + puzzle_number + '">' +
//         '<path d="' + border.top + border.right + border.bottom + border.left + '"></path>' +
//         '</clipPath>' +
//         '<g stroke="black" stroke-width="0">' +
//         '<g style="clip-path:url(#path' + puzzle_number + ')">' +
//         '<image xlink:href="' + image.src + '" x="' + (50 - (position.column - 1) * 150) +
//         '" y="' + (50 - (position.row - 1) * 150) +
//         '" width="' + image.naturalWidth * image_scale + '" height="' + image.naturalHeight * image_scale + '"></image>' +
//         '</g>' +
//         '<path class="puzzle-border" fill="transparent" d="' + border.top + border.right + border.bottom + border.left + '"></path>' +
//         '</g>' +
//         '</svg>';
//
//       var $svg = $(svg);
//       //$svg.attr('data-top',puzzle_number)
//
//       $svg.css({
//         'z-index': 1,
//         'shape-rendering': 'optimizeSpeed',
//         'image-rendering': image_rendering,
//         'fill-rule': 'evenodd',
//         'clip-rule': 'evenodd',
//         'position': 'absolute',
//         'cursor': 'pointer'
//       });
//       $svg.prop('column', position.column);
//       $svg.prop('row', position.row);
//       $svg.prop('size', puzzle_size);
//       $svg.prop('hold', false);
//       $svg.prop('puzzle_border_size', border_size);
//
//       return $svg;
//     }
//
//     /**
//      * Получить нужный border
//      * @param puzzle_quantity
//      * @param position
//      * @returns {{}}
//      */
//     function getBorder(puzzle_quantity, position) {
//
//       var b = {
//         top: {
//           smooth: 'M50,50',
//           outside: 'M50,50',
//           inside: 'M50,50'
//         },
//         right: {
//           smooth: ' L200,50',
//           outside: ' L200,50',
//           inside: ' L200,50'
//         },
//         bottom: {
//           smooth: ' L200,200',
//           outside: ' L200,200',
//           inside: ' L200,200'
//         },
//         left: {
//           smooth: ' L50,200z',
//           outside: ' L50,200',
//           inside: ' L50,200'
//         }
//       };
//       var border = {};
//
//       // TOP
//       if (position.row == 1)
//         border.top = b.top.smooth;
//       else {
//         if (puzzle_quantity.columns % 2 == 0) {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.top = b.top.outside;
//           }
//           else {
//             border.top = b.top.inside;
//           }
//         }
//         else {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.top = b.top.outside;
//           }
//           else {
//             border.top = b.top.inside;
//           }
//         }
//       }
//
//       // RIGHT
//       if (position.column == puzzle_quantity.columns)
//         border.right = b.right.smooth;
//       else {
//         if (puzzle_quantity.columns % 2 == 0) {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.right = b.right.inside;
//           }
//           else {
//             border.right = b.right.outside;
//           }
//         }
//         else {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.right = b.right.inside;
//           }
//           else {
//             border.right = b.right.outside;
//           }
//         }
//       }
//
//       // BOTTOM
//       if (position.row == puzzle_quantity.rows)
//         border.bottom = b.bottom.smooth;
//       else {
//         if (puzzle_quantity.columns % 2 == 0) {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.bottom = b.bottom.outside;
//           }
//           else {
//             border.bottom = b.bottom.inside;
//           }
//         }
//         else {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.bottom = b.bottom.outside;
//           }
//           else {
//             border.bottom = b.bottom.inside;
//           }
//         }
//       }
//
//       // LEFT
//       if (position.column == 1)
//         border.left = b.left.smooth;
//       else {
//         if (puzzle_quantity.columns % 2 == 0) {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.left = b.left.inside;
//           }
//           else {
//             border.left = b.left.outside;
//           }
//         }
//         else {
//           if (position.column % 2 == 0 && position.row % 2 == 0 || position.column % 2 != 0 && position.row % 2 != 0) {
//             border.left = b.left.inside;
//           }
//           else {
//             border.left = b.left.outside;
//           }
//         }
//       }
//
//
//       return border;
//
//     }
//
//   };
//   $.fn.puzzleOffset = function (position, set_parent) {
//
//     if (this.prop('puzzle_border_size')) {
//       if (position == undefined) {
//         var offset = this.offset();
//         return {
//           top: offset.top + this.prop('puzzle_border_size'),
//           left: offset.left + this.prop('puzzle_border_size')
//         };
//       }
//       else {
//         var $group = this.parent();
//
//         if (set_parent) {
//           var old_puzzle_offset = this.puzzleOffset();
//           var old_group_offset = $group.offset();
//
//           $group.offset({
//             left: old_group_offset.left - (old_puzzle_offset.left - position.left),
//             top: old_group_offset.top - (old_puzzle_offset.top - position.top)
//           });
//
//         }
//         else {
//           this.offset({
//             top: (position.top - this.prop('puzzle_border_size')),
//             left: position.left - this.prop('puzzle_border_size')
//           });
//         }
//       }
//     }
//
//   }
// })(jQuery);
//
// function concide() {
//   $("#id_concide").attr("disabled", true);
//   if (typeof timeloop !== 'undefined') {
//     $('.img_end').remove()
//     if (timeloop)
//       clearTimeout(timeloop)
//
//     $('#puzzle-board').fadeOut(function(){
//         $('.lose').css('display', 'flex');
//         $('.lose').fadeIn();
//         let size = sessionStorage.getItem('puzzle_size')
//         $('#puzzle-board').before('<div id="concide_image" style="margin:auto"><img style="image-rendering: ' + image_rendering + '" "width="' + size + '" height="' + size + '" class="img_end" src="' + image_url + '"></div>')
//     })
//   }
// }
//
// $(function(){
//   $('.fullscreen').on('click', function(){
//     $('#logo').fadeOut()
//     $('#header').fadeOut()
//     $('#game-start').fadeOut()
//     $('#game').fadeOut()
//     $('#modals').fadeOut()
//     $('#game-control').fadeOut()
//
//     $('#game').css('grid-area', '1 / 6 / 6 / 1')
//     $('#game').fadeIn()
//     $('#game *').fadeIn()
//   })
//   $('.theme').on('click', function(){
//     $(this).toggleClass('actvs')
//
//     if($(this).hasClass('actvs')){
//         $('#game').css('background', 'rgb(220,220,220)')
//       }else{
//         $('#game').css('background', '#1a3553')
//       }
//
//   })
//
//
// $(document).keydown(function(e) {
//     if( e.keyCode === 27 ) {
//         $('#logo').fadeIn()
//         $('#header').fadeIn()
//         $('#game-start').fadeIn()
//         $('#game').fadeIn()
//         $('#modals').fadeIn()
//         $('#game-control').fadeIn()
//         $('#game').css('grid-area', '2 / 2 / 3 / 4')
//
//         return false;
//     }
// });
//
//
// })
