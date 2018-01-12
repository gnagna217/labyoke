    $(document).ready(function() {
        var h = $(window).height();
        var wi = $(window).width();
        var topping = sessionStorage.getItem('topping');
        if (topping) {
            $(".login").css("margin-top", topping + "px");
        }
        $(".login").css("display", "block");
        console.log("topping bef: " + topping);
        $(function() {
            $.fn.center = function() {
                //var topping = $('.topping').attr("title");
                var t = ($(window).height() - this.height()) / 2;
                console.log("t forgot: " + t);
                console.log("topping after: " + topping);
                //var topping = sessionStorage.getItem('topping');
                var storedheight = sessionStorage.getItem('storedheight');
                var h = $(window).height();
                console.log("topping forgot: " + topping);
                console.log("sup forgot: " + (topping && parseInt(topping) > 0));
                if (topping && parseInt(topping) > 0 && storedheight && h == parseInt(storedheight)) {
                    t = parseInt(topping);
                } else if (t > 0) {
                    sessionStorage.setItem('topping', t - 5);
                    sessionStorage.setItem('storedheight', $(window).height());
                }

                if (t > 0) {
                    this.css("margin-top", t + "px");
                    this.css("-webkit-transition", "all .5s ease");
                    this.css("transition", "all .5s ease");
                }
                console.log("height forg: " + $(window).height());

                //$('.topping').attr("title",t);
                //this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
                return this;
            }

            if (!topping) {
                if (wi > 440) {
                    $(".login").center();
                }
            }

            $(window).resize(function() {
                if (wi > 440) {
                    $(".login").center();
                }
            });
        });
    });