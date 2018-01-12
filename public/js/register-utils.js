var h = $(window).height() - 125;
$(".marginbottom").css("min-height", h);

$('#messagejs1').hide();

$('#regbutton1').click(function() {
    console.log("regfirstname: " + $('#regfirstname').val());
    console.log("reglastname: " + $('#lastname').val());
    console.log("regemail: " + $('#regemail').val());
    console.log("regtel: " + $('#tel').val());
    if ($('#regfirstname').val() != "" && $('#lastname').val() != "" && $('#regemail').val() != "" && $('#tel').val() != "") {
        console.log("go on!");
        $('#regform1').submit();
    } else if ($('#regfirstname').val() == "" || $('#regfirstname').val() == undefined) {
        console.log("stop!");
        $('#messagejs1').html(var_register7);
        $('#messagejs1').show();
        return false;
    } else if ($('#lastname').val() == "" || $('#lastname').val() == undefined) {
        console.log("stop!");
        $('#messagejs1').html(var_register8);
        $('#messagejs1').show();
        return false;
    } else if ($('#regemail').val() == "" || $('#regemail').val() == undefined) {
        console.log("stop!");
        $('#messagejs1').html(var_register9);
        $('#messagejs1').show();
        return false;
    } else if ($('#tel').val() == "" || $('#tel').val() == undefined) {
        console.log("stop!");
        $('#messagejs1').html(var_register10);
        $('#messagejs1').show();
        return false;
    }
});


$('#regbutton2').click(function() {
    console.log("regverpass: " + $('#regverpass').val());
    console.log("regpass: " + $('#regpass').val());
    if ($('#reguser').val() != "" && $('#regverpass').val() != "" && $('#regverpass').val() == $('#regpass').val()) {
        console.log("go on!");
        $('#regform2').submit();
    } else if ($('#reguser').val() == "" || $('#reguser').val() == undefined) {
        console.log("stop!");
        $('#messagejs').html(var_register6);
        $('#messagejs').show();
        return false;
    } else if ($('#regverpass').val() == undefined || $('#regpass').val() == undefined || $('#regpass').val() == "" || $('#regverpass').val() == "" || $('#regverpass').val() != $('#regpass').val()) {
        console.log("stop!");
        $('#messagejs').html(var_register5);
        $('#messagejs').show();
        return false;
    }
});


$(document).ready(function() {
    if ($('#tel')) {
        $('#tel').mask("(999) 999-9999");
    }

    var toppinglogin = sessionStorage.getItem('toppinglogin');
    var topping = sessionStorage.getItem('topping');
    if (toppinglogin) {
        $(".login").css("margin-top", toppinglogin + "px");
    }

    $(".login").css("display", "block");
    var h = $(window).height();
    var wi = $(window).width();


    $(function() {
        $.fn.center = function() {
            //var topping = $('.topping').attr("title");


            var t = ($(window).height() - this.height()) / 2;

            console.log("topping after: " + topping);
            var storedheight = sessionStorage.getItem('storedheight');


            console.log("h window: " + h);
            console.log("sup forgot: " + (topping && parseInt(topping) > 0));

            if (t > 0) {
                sessionStorage.setItem('topping', t - 5);
                sessionStorage.setItem('toppinglogin', t - 5);
                sessionStorage.setItem('storedheight', h);
            }

            console.log("t login: " + t);
            console.log("height login : " + this.height());
            console.dir(this);
            console.log("height login 2 : " + $(".login").height());
            if (t > 0) {
                console.log("topping login: " + topping);
                this.css("margin-top", t + "px");
                this.css("-webkit-transition", "all .5s ease");
                this.css("transition", "all .5s ease");
            }

            //$('.topping').attr("title",t);

            //this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
            return this;
        }

        if (!toppinglogin && wi > 440) {
            $(".login").center();
        }

        $(window).resize(function() {
            if (wi > 440) {
                sessionStorage.removeItem('toppinglogin');
                $(".login").center();
            }
        });

    });
});