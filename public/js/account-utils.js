
          $(document).ready(function() {

          $(".sleepimg").click(function() {
                $( "#bot" ).show();
                $( ".awake" ).show();
                $( ".sleep" ).hide();
                $( "#popup1bot" ).show();
                $(".overlaybot").css({ 'visibility' : 'visible', 'opacity' : '1' });
                setTimeout(function() { $('.wc-shellinput').focus(); $(".wc-shellinput").attr("placeholder",var_bot_placeholder); }, 1000);
              });
          
          $(".close").click(function() {
                $( "#bot" ).hide();
                $( ".awake" ).hide();
                $( ".sleep" ).show();
                $( "#popup1bot" ).hide();
              });

          var h = $(window).height() - 125;
          $(".marginbottom").css("min-height",h);





            console.log( "account document loaded" );
            if ($("#checkdisplay").css("display") == "none" ){
              $('.slide-out-tip-div').hide();
            } else {
              $('.slide-out-tip-div').show();
            }

            var c = 0;
              if($('#emailOnFill:checked').length > 0){
                c = 1;
              }
            $('#changeonfill').find('.valuedetail').val($('#emailOnFill:checked').length);
            if(c == 1){
                $('.labelcheckonfill').css("left","30px");
                $('.labelcheckonfill').css("background","#2975b4");
              } else {
                $('.labelcheckonfill').css("left","0px");
                $('.labelcheckonfill').css("background","#8a6d3b");
              }

            $( ".labelcheckonfill" ).click(function() {
              var v = 1;
              if($('#emailOnFill:checked').length > 0){
                v = 0;
              }
              var change = 0;
              var onfill = "#{onfill}";
              console.log("onfill: " + onfill);
              console.log("v: " + v);

                
              if(v == 1){
                $('.labelcheckonfill').css("left","30px");
                $('.labelcheckonfill').css("background","#2975b4");
                change = 1;
              } else {
                $('.labelcheckonfill').css("left","0px");
                $('.labelcheckonfill').css("background","#8a6d3b");
              }
                $('#changeonfill').find('#valuedetail').val(v);
                $('#changeonfill').submit();
              
            });

            var c = 0;
              if($('#emailOnInsuff:checked').length > 0){
                c = 1;
              }
            $('#changeoninsuff').find('.valuedetail').val($('#emailOnInsuff:checked').length);
            if(c == 1){
                $('.labelcheckoninsuff').css("left","30px");
                $('.labelcheckoninsuff').css("background","#2975b4");
              } else {
                $('.labelcheckoninsuff').css("left","0px");
                $('.labelcheckoninsuff').css("background","#8a6d3b");
              }

            $( ".labelcheckoninsuff" ).click(function() {
              var v = 1;
              if($('#emailOnInsuff:checked').length > 0){
                v = 0;
              }
              var change = 0;
              var oninsuff = "#{oninsuff}";
              console.log("oninsuff: " + oninsuff);
              console.log("v: " + v);

                
              if(v == 1){
                $('.labelcheckoninsuff').css("left","30px");
                $('.labelcheckoninsuff').css("background","#2975b4");
                change = 1;
              } else {
                $('.labelcheckoninsuff').css("left","0px");
                $('.labelcheckoninsuff').css("background","#8a6d3b");
              }
                $('#changeoninsuff').find('#valuedetail').val(v);
                $('#changeoninsuff').submit();
              
            });


            $('#changetel input[id="valuedetail"]').mask("(999) 999-9999");




          });

         $(function(){
             $('.slide-out-tip-div').tabSlideOut({
                 imgPos: 85,
                 tabHandle: '.handle',                              //class of the element that will be your tab
                 pathToTabImage: 'images/bouee5.png',          //path to the image for the tab (optionaly can be set using css)
                 imageHeight: '50px',                               //height of tab image
                 imageWidth: '50px',                               //width of tab image    
                 tabLocation: 'right',                               //side of screen where tab lives, top, right, bottom, or left
                 speed: 300,                                        //speed of animation
                 action: 'click',                                   //options: 'click' or 'hover', action to trigger animation
                 topPos: '25% !important',                                   //position from the top
                 fixedPosition: true                               //options: true makes it stick(fixed position) on scroll
             });
         });

                                    window.onload = function() {
                                      document.getElementById("selectlang").onchange = function() {
                                        console.log("changing language " + $('#selectlang').val());
                                        $('#changelang').find($('input#valuedetail')).val($('#selectlang').val());
                                        $('#changelang').submit();      
                                      };
                                    };

              $('#teamTitle').click(function() {
                  if($('#team').is(":visible")){
                    $('.accountlogo').show();
                    $('#team').hide();
                    $('#teamTitle').html(var_account_button);
                    $('#teamTitle').css('background-color','#8a6d3b');
                    $("#teamTitle").mouseenter(function() {
                    $(this).css("background", "#2975b4");
                    }).mouseleave(function() {
                         $(this).css("background", "#8a6d3b");
                    });
                  } else {
                    $('.accountlogo').hide();
                    $('#team').show();
                    $('#teamTitle').html(var_account_hide_button);
                    $('#teamTitle').css('background-color','#2975b4');
                    $("#teamTitle").mouseenter(function() {
                    $(this).css("background", "#8a6d3b");
                    }).mouseleave(function() {
                         $(this).css("background", "#2975b4");
                    });
                    console.log("team inside: " + $('#team').offset().top);
                    $(window).scrollTop($('#team').offset().top).scrollLeft($('#team').offset().left);
                  }   
              });  