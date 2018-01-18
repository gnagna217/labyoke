            $( document ).ready(function() {
            var toppinglogin = sessionStorage.getItem('toppinglogin');
            var topping = sessionStorage.getItem('topping');
            if(toppinglogin){
                $(".login").css("margin-top", toppinglogin + "px");
            }
                
            $(".login").css("display", "block");
            var h = $(window).height();
            var wi = $(window).width();

                console.log("removing topped");

            $( "#user" ).focus(function() {
              $(".fa-user").css("color","rgba(61, 157, 203, 0.78)");
            });

            $( "#user" ).focusout(function() {
                $(".fa-user").css("color","rgba(138, 109, 59, 0.61)");
            });

            $( "#pass" ).focus(function() {
              $(".fa-key").css("color","rgba(61, 157, 203, 0.78)");
            });

            $( "#pass" ).focusout(function() {
                $(".fa-key").css("color","rgba(138, 109, 59, 0.61)");
            });

            console.log( "login document loaded" );

                $(function(){
                    $.fn.center = function () {
                    //var topping = $('.topping').attr("title");

                    
                    var t = ($(window).height() - this.height() ) / 2  ;

                    console.log("topping after: " + topping);
                    var storedheight = sessionStorage.getItem('storedheight');
                    
                    
                    console.log("h window: " + h);
                    console.log("sup forgot: " + (topping && parseInt(topping) > 0));
                    
                    if(t>0){
                    sessionStorage.setItem('topping', t - 5);
                    sessionStorage.setItem('toppinglogin', t - 5);
                    sessionStorage.setItem('storedheight', h);
                    }
                    
                    console.log("t login: " + t);
                    console.log("height login : " + this.height());
                    console.dir(this);
                    console.log("height login 2 : " + $(".login").height());
                    if(t > 0){
                    console.log("topping login: " + topping);
                    this.css("margin-top",  t + "px");
                    this.css("-webkit-transition","all .5s ease");
                    this.css("transition","all .5s ease");
                    }
                    
                    //$('.topping').attr("title",t);
                    
                    //this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
                    return this;
                    }

                    if(!toppinglogin && wi > 440){
                        $(".login").center();
                    }

                    $(window).resize(function(){
                        if(wi > 440){
                            sessionStorage.removeItem('toppinglogin');
                            $(".login").center();
                        }
                    });

                });
            });
