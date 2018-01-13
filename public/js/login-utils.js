            $('.slide-out-div').tabSlideOut({
                 imgpos: 75,
                 tabHandle: '.handle', //class of the element that will be your tab
                 pathToTabImage: 'images/movarrow2.gif', //path to the image for the tab (optionaly can be set using css)
                 imageHeight: '40px', //height of tab image
                 imageWidth: '40px', //width of tab image    
                 tabLocation: 'bottom', //side of screen where tab lives, top, right, bottom, or left
                 speed: 300, //speed of animation
                 action: 'click', //options: 'click' or 'hover', action to trigger animation
                 topPos: 'initial', //position from the top
                 fixedPosition: false //options: true makes it stick(fixed position) on scroll
             });


         $(document).ready(function() {

             var toppinglogin = sessionStorage.getItem('toppinglogin');
             var topping = sessionStorage.getItem('topping');
             if (toppinglogin) {
                 $(".login").css("margin-top", toppinglogin + "px");
             }

             $(".login").css("display", "block");
             var h = $(window).height();
             var wi = $(window).width();

             console.log("removing topped");

             $("#user").focus(function() {
                 $(".fa-user").css("color", "rgba(61, 157, 203, 0.78)");
             });

             $("#user").focusout(function() {
                 $(".fa-user").css("color", "rgba(138, 109, 59, 0.61)");
             });

             $("#pass").focus(function() {
                 $(".fa-key").css("color", "rgba(61, 157, 203, 0.78)");
             });

             $("#pass").focusout(function() {
                 $(".fa-key").css("color", "rgba(138, 109, 59, 0.61)");
             });

             var s = ["images/en.png", "images/bouee5.png", "images/fr.png", "images/yoke4.png", "images/movarrow2.gif", "images/venn.png", "images/card3_0.png", "images/bouee6.png", "images/cart.png", "images/carthover.png", "images/card.jpg", "images/card2_0.jpg"];
             imageCache.pushArray(s, function() {}, function() {});

             console.log("login document loaded");
             if ($("#checkdisplay").css("display") == "none") {
                 $('.slide-out-div').hide();
             } else {
                 $('.slide-out-div').show();
             }
             $(".handle").css("top", "-75px");



             $(function() {
                 $.fn.center = function() {
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