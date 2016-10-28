var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	service : "Gmail",
	auth : {
		user : "labyoke@gmail.com",
		pass : "gnandria2016"
	}
});

var transport = nodemailer.createTransport("SMTP", {
    host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "labyoke@gmail.com",
        pass: "gnandria2016"
    }
});

// setup e-mail data with unicode symbols
var MailOptions = function(to, subject, body) {
	this.from = "Lab Yoke <labyoke@gmail.com>";
	this.to = to;
	this.subject = subject;
	this.body = body;
}

MailOptions.prototype.sendAllEmails = function() {
	// send mail with defined transport object
	console.log("call send all emails " + this.to);
	var mailOptions = {
		from : this.from,
		to : this.to,
		subject : this.subject,
		html : this.body
	}
	transport.sendMail(mailOptions, function(error, response) {
		console.log("sent");
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}

		// if you don't want to use this transport object anymore, uncomment
		// following line
		//transport.close(); // shut down the connection pool, no more
								// messages
	});
};

exports.MailOptions = MailOptions;
