function radioclick() {
    $("#keysearch").show();
    $("#catalogsearch").hide();
    $('input[name=search][value=keysearch]').prop('checked', 'checked');
}

function radiocatclick() {
    $("#keysearch").hide();
    $("#catalogsearch").show();
    $('input[name=search][value=catalogsearch]').prop('checked', 'checked');
}

$(document).ready(function() {


    $(".sleepimg").click(function() {
        $("#bot").show();
        $(".awake").show();
        $(".sleep").hide();
        $("#popup1bot").show();
        $(".overlaybot").css({
            'visibility': 'visible',
            'opacity': '1'
        });
        setTimeout(function() {
            $('.wc-shellinput').focus();
            $(".wc-shellinput").attr("placeholder", var_bot_placeholder );
        }, 1000);
    });

    $(".close").click(function() {
        $("#bot").hide();
        $(".awake").hide();
        $(".sleep").show();
        $("#popup1bot").hide();
    });

    var h = $(window).height() - 125;
    $(".marginbottom").css("min-height", h);

    console.log("catalogradio: " + "#{catalogradio}");
    console.log("searchradio: " + "#{searchradio}");
    console.log("searchType: " + "#{searchradioType}");
    var existscatalog = "#{catalogradio}";
    var existskey = "#{searchradio}";
    var existssearchType = "#{searchradioType}";
    console.log(" length catalogradio: " + existscatalog.length);
    console.log("length searchradio: " + existskey.length);
    if (existskey.length > 0 || existssearchType == "key") {
        $("#keysearch").show();
        $("#catalogsearch").hide();
        $('input[name=search][value=keysearch]').prop('checked', 'checked');
        console.log("existssearchType is key: " + existssearchType);
        $("#loopkey").removeClass("colmenu");
        $("#loopkey").addClass("activecolmenu");
        $("#loopcatalog").removeClass("activecolmenu");
        $("#loopcatalog").addClass("colmenu");
    } else if (existscatalog.length > 0 || existssearchType == "catalog") {
        $("#keysearch").hide();
        $("#catalogsearch").show();
        $('input[name=search][value=catalogsearch]').prop('checked', 'checked');
        console.log("existssearchType is cat: " + existssearchType);
        $("#loopcatalog").removeClass("colmenu");
        $("#loopcatalog").addClass("activecolmenu");
        $("#loopkey").removeClass("activecolmenu");
        $("#loopkey").addClass("colmenu");
    } else {
        $("#keysearch").show();
        $("#catalogsearch").hide();
        $('input[name=search][value=keysearch]').prop('checked', 'checked');
        $("#loopcatalog").removeClass("activecolmenu");
        $("#loopcatalog").addClass("colmenu");
        $("#loopkey").removeClass("activecolmenu");
        $("#loopkey").addClass("colmenu");
    }


    $("input[name=search]").on("change", function() {
        var test = $(this).val();
        if (test == "catalogsearch") {
            $("#keysearch").hide();
            $("#catalogsearch").show();
        } else {
            $("#keysearch").show();
            $("#catalogsearch").hide();
        }


    });




    if ($('#ordered').length > 0) {
        var l = $('#ordered').offset().top;
        if (l > 100) {
            l -= 100;
        }
        console.log("scrolling ordered : " + l);
        $('html,body').animate({
            scrollTop: 500
        }, 1000);
    }


    if ($('table').length > 0) {
        var l = $('table').offset().top;
        if (l > 100) {
            l -= 100;
        }
        console.log("scrolling " + l);
        $('html,body').animate({
            scrollTop: l
        }, 1000);
    }


    $('.removecard').click(function() {

        console.log("hiding");
        console.debug($(this));
        console.debug($(this).parent());
        $(this).parent().css("background-color", "rgba(51, 122, 183, 0.78)");

        $(this).parent().animate({
            paddingLeft: '+=20px',
            fontSize: "-=0.4em",
            marginLeft: '+=50px',
            width: '-=50px',
            height: '-=50px'
        }, 500, function() {
            $(this).hide();
        });

    });

    $('#rankTblSearch').DataTable({
        language: {
            processing: var_processing,
            search: var_search,
            lengthMenu: var_lengthMenu,
            info: var_info,
            infoEmpty: var_infoEmpty,
            infoFiltered: var_infoFiltered,
            infoPostFix: "",
            loadingRecords: var_loadingRecords,
            zeroRecords: var_zeroRecords,
            emptyTable: var_emptyTable,
            paginate: {
                first: var_first,
                previous: var_previous,
                next: var_next,
                last: var_last,
                searchPlaceholder: var_searchplaceholder
            },
            aria: {
                sortAscending: var_sortAscending,
                sortDescending: var_sortDescending
            }
        }
    });



    $(".imgcart").hover(
        function() {
            $(this).attr("src", "images/carthover.png");
        },
        function() {
            $(this).attr("src", "images/cart.png");
        });
    /*if($('.results10').is(':visible')){
      console.log("scrolling " + $('.results10').offset().top);
      $(window).scrollTop(550);
    }*/
    console.log("search document loaded");
    if ($("#checkdisplay").css("display") == "none") {
        $('.slide-out-tip-div').hide();
    } else {
        $('.slide-out-tip-div').show();
    }

    if ($('.results10').is(':visible')) {
        console.log("results visible ");
        $(".searchlogo").removeAttr("style");
        $(".searchlogo").removeClass("animated fadeInDown");
    }

    $(function() {
        $.fn.center = function() {
            if (!$('.results10').is(':visible')) {
                console.log("results visible ");
                this.removeAttr("style");
                console.log("this.height() login: " + this.height());
                console.log("$(window).height() login: " + $(window).height());
                var t = ($(window).height() - this.height() - 200) / 2;
                console.log("t login: " + t);
                if (t > 0) {
                    console.log("inside t");
                    this.css("margin-top", t + "px");
                    this.css("-webkit-transition", "all .5s ease");
                    this.css("transition", "all .5s ease");
                }
            }
            return this;
        }
        $(".container2").center();
        $(window).resize(function() {
            $(".container2").center();
        });

    });

    $(function() {
        $('.slide-out-tip-div').tabSlideOut({
            imgPos: 100,
            tabHandle: '.handle', //class of the element that will be your tab
            pathToTabImage: 'images/bouee5.png', //path to the image for the tab (optionaly can be set using css)
            imageHeight: '50px', //height of tab image
            imageWidth: '50px', //width of tab image    
            tabLocation: 'right', //side of screen where tab lives, top, right, bottom, or left
            speed: 300, //speed of animation
            action: 'click', //options: 'click' or 'hover', action to trigger animation
            topPos: '25% !important', //position from the top
            fixedPosition: true //options: true makes it stick(fixed position) on scroll
        });
    });
});