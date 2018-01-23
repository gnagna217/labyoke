function notify(body, title) {
  // Let's check if the browser supports notifications
  console.log("sharesnum : " + getCookie("sharesnum"));
    var options = {
    body: body,
    requireInteraction: true
    //icon: "/images/yoke4.png"
    };
  if (!("Notification" in window)) {
    console.log("This application does not support notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    if(getCookie("notified") == ""){
    // If it's okay let's create a notification
   var notification = new Notification(title,options); 
   document.cookie = "notified=true";
}
   console.log("here : " + getCookie("notified"));
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(var_title,options);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}