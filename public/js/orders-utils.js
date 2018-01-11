
          $(document).ready(function() {

        
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





                        var win = $( window ).width();
                        console.log(win);
                        if(win < 767){
                          $("#order-container").css( "min-height", "0px" );
                        }
                        $("#rankTblOrders").css( "width", "100%" );
                        
                      });

         $(function(){
             $('.slide-out-tip-div').tabSlideOut({
                 imgPos: 100,
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

                        $('#rankTblOrders').DataTable({order: [[ 5, "desc" ]],
                          iDisplayLength: 5,
                          aLengthMenu: [[5, 10, 15, -1], [5, 10, 15, "All"]],
                          language:{
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





