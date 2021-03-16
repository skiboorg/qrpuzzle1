
//========== variables
freader = new FileReader();
puzzleh = $("#puzzle-pre").height();
puzzlew = $("#puzzle-pre").width();
totalAmount = 60 *4
timeloop = ''
img = ''

//======== win time
function timeSet1(t) {
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

    timeloop = setTimeout(timeSet1, 1000);
}

$(document).ready(function() {
    if (!localStorage.wintime) localStorage.wintime = 0;
    $("#wintime").text("You Win " + localStorage.wintime + " Time");
});

//========== Load The Image
$("#inpfile").change(function() {
    freader.readAsDataURL(this.files[0]);
    freader.onloadend = function() {
        // sessionStorage.imgsrc = freader.result;
        $("#puzzle-pre")
            .html("")
            .html(
                '<img src="' + sessionStorage.imgsrc + '" height="100%" width="100%">'
            );
    };
});

function slider(p,t,l) {


    document.getElementById('id_concide').classList.remove('btnDisabled')
    totalAmount = 60 *t
    clearTimeout(timeloop)
    start_slider(p,t,l)


}

//=========== StartGame
function start_slider(p,t,l) {


    console.log('slider-start')
    $.ajax({
        method: "POST",
        url: "/game/start/",
        data: {'puzzle_length': l,'game_type':1},
        headers: { 'X-CSRFToken':document.getElementsByName('csrfmiddlewaretoken')[0].value },
        success: function(response) {
            console.log(response)
            app.current_game_id = response.game_id
            image_url = response.image
            console.log('image_url',image_url)

            //sessionStorage.imgsrc = response.image;
            img = response.image;

            //variables
            h = puzzleh / p;
            w = puzzlew / p;
            xpos = 0;
            ypos = 0;

            //creat puzzle pieces
            $("#puzzle-cont").html("");

            if (p===3){
                for (i = 0; i < 9; i++) {
                    if (i === 3 || i === 6) {
                        xpos = 0;
                        ypos -= h;
                    }
                    item = $(document.createElement("div"));
                    $("#puzzle-cont").append(item);
                    item
                        .css({
                            height: h,
                            width: w,
                            "background-image": "url(" + img + ")",
                            "background-size": puzzlew + "px" + " " + puzzleh + "px",
                            "background-position": xpos + "px" + " " + ypos + "px"
                        })
                        .attr("class", "puzzle-piece")
                        .attr("id", "puzzle-p")
                        .attr("value", i);
                    xpos -= w;
                }
            }
            if (p===4){
                for (i = 0; i < 16; i++) {
                    if (i === 4 || i === 8 || i === 12 ) {
                        xpos = 0;
                        ypos -= h;
                    }
                    item = $(document.createElement("div"));
                    $("#puzzle-cont").append(item);
                    item
                        .css({
                            height: h,
                            width: w,
                            "background-image": "url(" + img + ")",
                            "background-size": puzzlew + "px" + " " + puzzleh + "px",
                            "background-position": xpos + "px" + " " + ypos + "px"
                        })
                        .attr("class", "puzzle-piece")
                        .attr("id", "puzzle-p")
                        .attr("value", i);
                    xpos -= w;
                }
            }
            if (p===5){
                for (i = 0; i < 25; i++) {
                    if (i === 5 || i === 10 || i === 15 || i === 20) {
                        xpos = 0;
                        ypos -= h;
                    }
                    item = $(document.createElement("div"));
                    $("#puzzle-cont").append(item);
                    item
                        .css({
                            height: h,
                            width: w,
                            "background-image": "url(" + img + ")",
                            "background-size": puzzlew + "px" + " " + puzzleh + "px",
                            "background-position": xpos + "px" + " " + ypos + "px"
                        })
                        .attr("class", "puzzle-piece")
                        .attr("id", "puzzle-p")
                        .attr("value", i);
                    xpos -= w;
                }
            }



            // container rotate
            // $("#main").css("transform", "rotateY(180deg)");
            $("#puzzle-pre").css("z-index", "1");
            $("#puzzle-cont").css("z-index", "2");

            timeSet1(t)
            //make puzzle
            function random(min, max) {
                return Math.floor(Math.random() * max - min);
            }
            item = document.getElementsByClassName("puzzle-piece");
            ritem = [0];
            val = [0];
            for (i = 0; i < item.length; i++) {
                do {
                    myrand = random(0, item.length);
                } while (ritem.indexOf(myrand) > -1);
                ritem[i] = myrand;
                $("#puzzle-cont").append(item[myrand]);
                val[i] = i.toString();
            }

            // check win game
            firstTime = true;
            function winAlert(obj) {
                if (obj && firstTime === true) {
                    $("#win").text("Congratulation YOU WIN");
                    localStorage.wintime = parseInt(localStorage.wintime) + 1;
                    firstTime = false;
                    $("#wintime").text("You Win " + localStorage.wintime + " Time");
                    document.getElementById('id_concide').classList.add('btnDisabled')
                    let body = {'game_id':app.current_game_id}
                    fetch('/game/win/', {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: { "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value  },
                        credentials: 'same-origin'
                    }).then(res=>res.json())
                        .then(res => {
                            clearTimeout(timeloop)
                            app.result_title = 'YOU WIN'
                            app.result = true
                            app.result_image_modal = true
                            app.result_image = image_url
                            setInterval(() => app.counter--, 1000);

                            setTimeout( function (){
                                app.showClose = true
                            }, 20000);
                            console.log(res)
                            // document.getElementsByClassName('win-label')[0].classList.add('winLabelActive')
                            document.getElementById('rating_desktop').innerText = res['rating']

                        })

                }
            }

            function compareArray(array1, array2) {
                chk = null;
                if (array1.length === array2.length) {
                    for (i = 0; i < array1.length; i++) {
                        if (array1[i] !== array2[i]) {
                            chk = false;
                        }
                    }
                    if (chk !== false) return true;
                }
                return false;
            }

            $(".puzzle-piece").hover(function() {
                i = 0;
                checkval = [0];
                item = document.getElementsByClassName("puzzle-piece");
                while (i < item.length) {
                    if (item[i].getAttribute("value"))
                        checkval[i] = item[i].getAttribute("value");
                    i++;
                }
                winAlert(compareArray(checkval, val));
            });

            //sortable
            $("#puzzle-cont").sortable();




        }
    })

};

