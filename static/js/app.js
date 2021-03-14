/**
 * Created by Sergey on 14-Oct-16.
 */

(function () {
   $(window).ready(init);
})();

function init() {
/*
	$('#puzzle-board').puzzle({
        image: 'puzle/images/landscape_02.jpg',
        size: 250,
        scale: 1
    });*/


$('.complexity_btn').on('click', function(e){
  app.open_mobile_menu()
  app.mobile_sub_menu = ''
    app.loaderActive = true
  document.getElementById('id_concide').classList.remove('btnDisabled')
  // document.getElementsByClassName('win-label')[0].classList.remove('winLabelActive')
  // document.getElementsByClassName('lose-label')[0].classList.remove('loseLabelActive')
  e.preventDefault()

  $('.puzzle-group').remove() // for bug sometimes game not ended
  $('.img_end').remove() // remove concide image
  $('#concide_image').remove() // remove concide image div

  $('.lose').fadeOut();
  $('.complexity_btn').removeClass('active_complexity_btn');
	$('#puzzle-board svg').remove()
	$('.complexity_btn').removeClass('active');
  $('.complexity_btn').prop('disabled', true);
  $(this).addClass('active_complexity_btn')

  var lengthPuzle = $(this).data('puzle');
  var level_id = $(this).data('level');
  var levelBtn1 = document.getElementById(`btn_level_1`);
  var levelBtn2 = document.getElementById(`btn_level_2`);
  var levelBtn3 = document.getElementById(`btn_level_3`);
  levelBtn1.classList.add('btnDisabled')
  levelBtn2.classList.add('btnDisabled')
  levelBtn3.classList.add('btnDisabled')
  let data = sessionStorage.getItem('key');
  app.showClose = false
  $.ajax({
    method: "POST",
    url: "/game/start/",
    dataType: "json",
    data: {'puzzle_length': lengthPuzle,'game_type':app.game_type},
    headers: { 'X-CSRFToken':document.getElementsByName('csrfmiddlewaretoken')[0].value },
    success: function(response) {
      if (response.code == 200)
      {
        var level = response.level;
        app.current_game_id = response.game_id
        var parAmt = response.timer;
        if (typeof timeloop !== 'undefined')
          if (timeloop)
            clearTimeout(timeloop)

        sessionStorage.setItem('level', level);
        image_url = response.image
        console.log(image_url)

        var scale = (screen.height / 1080).toFixed(1)
          console.log('scale',scale)
        sessionStorage.setItem('puzzle_size', scale*100);

        $('#puzzle-board').puzzle({
        	image: image_url,
        	size: lengthPuzle,
        	scale: scale
        });

        totalAmount = parAmt * 60;
        timeSet();
        levelBtn1.classList.remove('btnDisabled')
        levelBtn2.classList.remove('btnDisabled')
        levelBtn3.classList.remove('btnDisabled')
          app.loaderActive = false
      }
      else if (response.code == 400)
        alert(response.error)
      else
        alert('Unexpected error.')
    }
  })
})


}
