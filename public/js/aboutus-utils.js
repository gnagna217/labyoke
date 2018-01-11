function rotateCard(btn){
    var $otherbutton;
    var $card = $(btn).closest('.teamcolumn');
    var classname = $(btn).parent().attr("class");
    console.log("classname: " + classname);
    if(classname == "frontbutton"){
      $otherbutton = $(btn).parent().next('.backbutton');
    } else {
      $otherbutton = $(btn).parent().prev('.frontbutton');
    }
    console.log($otherbutton);
    var $front = $card.find('.front');
    if($card.hasClass('hover')){
        $card.removeClass('hover');
        $front.show();
        //$(btn).parent().hide();
        //$otherbutton.show();
    } else {
        $card.addClass('hover');
        $front.hide();
        //$(btn).parent().hide();
        //$otherbutton.show();
    }
}
$(window).on('load', function() {
  var h = 200 + $('.fronthelp').height() + $('.section2').height() + $('.front1').height();
  console.log("container height: " + h);

  var h0 = $(window).height() - 125;
  $(".marginbottom").css("min-height",h0);
});