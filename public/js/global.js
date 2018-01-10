$(function(){
    $('#popup1bot').draggable({
      handle: ".modal-header"
  });
    $('#popup1bot').resizable();

  $('.sleep').draggable({
      handle: ".sleep0"
  });
    $('.sleep').resizable();
  
});
$(document).ready(function() {

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

function hasTouch() {
    return 'ontouchstart' in document.documentElement
           || navigator.maxTouchPoints > 0
           || navigator.msMaxTouchPoints > 0;
}
if(!hasTouch()){
  var query = $('#bot');
  var isVisible = query.is(':visible');
  if (isVisible === true) {
  //var botchat = document.querySelector("#bot");
  //if(botchat != undefined && botchat != null){

  BotChat.App({
    directLine: { secret: "jMO0wtNhTWM.cwA.rqg._IWRYZZ7OsyoD0F6JfuPEDOnw6SP48-pAnIRptYH3mE" },
    user: { id: '#{labyoker}' },
    bot: { id: 'Labyoke' },
    resize: 'detect'
  }, document.getElementById("bot"));
  $( "#bot" ).hide();
  }
} 


//$('[data-toggle="tooltip"]').tooltip({placement: "bottom"});
var options = {
  max_zoom: 1.3, // maximum amount you can zoom in. 1.5 = 150% zoom
  min_zoom: .7, // the minimum amount you can zoom out. .5 = 50% zoom
  zoom_increment: .1, // how much each click zooms in/out. So if the current zoom is 1.3, one click of the zoom out link means 1.3 - 0.1 = 1.2. New zoom level is 1.2
  current_zoom: 1, // default zoom. don't set this unless you want to force a zoom level on each page load
  selectors: {
    zoom_in: '.zoom_in', // the selector for the element(s) that will get the zoom in action for the onclick event
    zoom_out: '.zoom_out', // the selector for the element(s) that will get the zoom out action for the onclick event
    zoom_reset: '.zoom_reset' // the selector for the element(s) that will get the reset zoom action for the onclick event
  }
};

$.page_zoom(options);});
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

var logout = document.querySelector(".nav-menu-logout");
// On click
if(logout != undefined && logout != null){
logout.addEventListener("click", function() {
      $(".menu-border").css("border-left-color", "transparent");
      $("#menumyshares").css("border-left-color", "transparent");
    });
}
