
          $(document).ready(function() {

          	var l = "#{language}";
        console.log("l is: " + l);
        MYLIBRARY.init([l]);

          $(".sleepimg").click(function() {
                $( "#bot" ).show();
                $( ".awake" ).show();
                $( ".sleep" ).hide();
                $( "#popup1bot" ).show();
                $(".overlaybot").css({ 'visibility' : 'visible', 'opacity' : '1' });
                setTimeout(function() { $('.wc-shellinput').focus(); $(".wc-shellinput").attr("placeholder",'#{i18n.__("layout.bot.placeholder")}'); }, 1000);
              });
          
          $(".close").click(function() {
                $( "#bot" ).hide();
                $( ".awake" ).hide();
                $( ".sleep" ).show();
                $( "#popup1bot" ).hide();
              });

          var h = $(window).height() - 125;
          $(".marginbottom").css("min-height",h);

          
          });