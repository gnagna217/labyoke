function notify(body, title) {
  // Let's check if the browser supports notifications
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
    // If it's okay let's create a notification
   var notification = new Notification(title,options); 
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