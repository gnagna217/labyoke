        $(".nav-menu-logout").click(function() {
                    $( this ).addClass( "animated hinge" );
                    setTimeout(function() {
                      window.location.href = "/logout";
                    }, 2000);
                    });
        // Look for .hamburger
        var hamburger = document.querySelector(".hamburger");
        // On click
        if(hamburger != undefined && hamburger != null){
        hamburger.addEventListener("click", function() {
          // Toggle class "is-active"
          hamburger.classList.toggle("is-active");
          // Do something else, like open/close menu
          console.log("clicked hamburger.");
        });
        }

        $(".closemenu").click(function() {
            if($("#navburger").hasClass('in')){$(".hamburger").click();}
        });

        jQuery(document).ready(function($){
          // browser window scroll (in pixels) after which the "back to top" link is shown
          var offset = 300,
            //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
            offset_opacity = 1200,
            //duration of the top scrolling animation (in ms)
            scroll_top_duration = 700,
            //grab the "back to top" link
            $back_to_top = $('.cd-top');

          //hide or show the "back to top" link
          $(window).scroll(function(){
            ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
            if( $(this).scrollTop() > offset_opacity ) { 
              $back_to_top.addClass('cd-fade-out');
            }
          });

          //smooth scroll to top
          $back_to_top.on('click', function(event){
            event.preventDefault();
            $('body,html').animate({
              scrollTop: 0 ,
              }, scroll_top_duration
            );
          });

        });