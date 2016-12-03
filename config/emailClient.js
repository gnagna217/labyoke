var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	service : "Gmail",
	auth : {
		user : "labyoke@gmail.com",
		pass : "gnandria2016"
	}
});

/*var transport = nodemailer.createTransport("SMTP", {
    host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "labyoke@gmail.com",
        pass: "gnandria2016"
    }
});*/

var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        XOAuth2: {
            user: "labyoke@gmail.com",
            clientId: "722270197322-ba4h9ej1d7lqllqth5oe34ho8bjvl9bl.apps.googleusercontent.com",
            clientSecret: "Ts9mTuEvbucJhGdX0i0ls4IK",
            refreshToken: "1/DzM6boa47mzTHZ-_14Tp77KWyrblp-AR-SYmVkZR000"
        }
    }
});

// setup e-mail data with unicode symbols
var MailOptions = function(to, subject, body) {
	this.from = "Lab Yoke <labyoke@gmail.com>";
	this.to = to;
	this.subject = subject;
	this.body = body;
}

var MailOptionsWithCC = function(to, subject, body, cc) {
	this.from = "Lab Yoke <labyoke@gmail.com>";
	this.to = to;
	this.cc = cc;
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

MailOptionsWithCC.prototype.sendAllEmails = function() {
	// send mail with defined transport object
	console.log("call send all emails " + this.to);
	var mailOptions = {
		from : this.from,
		to : this.to,
		cc : this.cc,
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
exports.MailOptionsWithCC = MailOptionsWithCC;
