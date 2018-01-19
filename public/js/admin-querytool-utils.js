$(document).ready(function() {
   $('#rankTblload').DataTable();
   $("#queryText").val(var_searchtext)
});

                var rem = var_remove;
                if(rem == '0'){
                    $('#raw').remove();
                    $('#queryresults').remove();
                } else {
                    $(window).scrollTop($('.results').offset().top + 100).scrollLeft($('.results').offset().left);
                }
                labyokerslink.onclick = function(){
                $(".queryseparator").toggle();
                $("#labyokers").toggle();
                $(window).scrollTop($('#labyokers').offset().top).scrollLeft($('#labyokers').offset().left);
                };