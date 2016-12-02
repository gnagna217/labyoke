var pg = require("pg");
var moment = require('moment-timezone');
var MailOptions = require('../config/emailClient').MailOptions;
var MailOptionsWithCC = require('../config/emailClient').MailOptionsWithCC;
var config = require("../config/database");
var conString = process.env.DATABASE_URL || "pg://" + config.username + ":"
		+ config.password + "@" + config.host + ":" + config.port + "/"
		+ config.database;
console.log("connection db could be: " + process.env.DATABASE_URL);
console.log("connection db is: " + conString);
//pg.defaults.ssl = true;
var client = new pg.Client(conString);
client.connect();
var crypt = require('bcrypt-nodejs');

LabYokeFinder = function(today) {
	this.now = today
};

LabYokeAgents = function(email) {
	this.email = email;
};

LabYokeReporter = function(datefrom, dateto) {
	this.datefrom = datefrom;
	this.dateto = dateto;
};

LabYokeSearch = function(searchText) {
	this.searchText = searchText;
};

LabYokeUploader = function(jsonResults) {
	this.jsonResults = jsonResults;
};

LabYokerOrder = function(agent, vendor,catalognumber,email,location,sendemail) {
	this.agent = agent;
	this.vendor = vendor;
	this.catalognumber = catalognumber;
	this.email = email;
	this.location = location;
	this.sendemail = sendemail;
};

LabYokerGetOrder = function(sendemail) {
	this.sendemail = sendemail;
};

LabyokerRegister = function(user, password,lab,firstname,lastname,email,tel) {
	this.username = user;
	this.password = password;
	this.lab = lab;
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.tel = tel;
};

LabyokerPasswordChange = function(hash, password) {
	this.hash = hash;
	this.password = password;

};


LabYokeUploader.prototype.upload = function(callback) {
	/*var agent = this.agent;
	var vendor = this.vendor;
	var catalognumber = this.catalognumber;
	var location = this.location;
	var email = this.email;*/
	var results = this.jsonResults;
	console.log("location: " + location);
	var values = "";
	var now = moment(new Date).tz("America/New_York").format('YYYY-MM-DD');

	if(results != null){
		for(var prop in results){
			var agent = results[prop].name_of_reagent;
			var vendor = results[prop].vendor;
			var catalognumber = results[prop].catalog_number;
			var location = results[prop].location;
			var email = results[prop].user;
			var category = results[prop].category;
			values = values + "('" + agent
		+ "', '" + vendor + "', '" + catalognumber + "', '" + location + "', '" + email + "','" + now + "','" + category + "','new')";
			if(prop < (results.length-1)){
				values = values + ",";
			}
		}
	}
	console.log("values " + values);

	if(values!= null){
		var query2 = client.query("INSERT INTO vm2016_agentsshare VALUES " + values);

		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			console.log("successfulUpload");
			callback(null, "successfulUpload");
		});
			
	} else {
		//Change Password already sent
		console.log("cannotUploadMissingData.");
		callback(null, "cannotUploadMissingData");
	}
};

LabYokeReporter.prototype.reportShares = function(callback) {
	var results;
	var datefrom = this.datefrom;
	var dateto = this.dateto;
	console.log("report on something: datefrom: " + datefrom);
	console.log("report on something: dateto: " + dateto);
	var query;
	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		query = client.query("SELECT * FROM vm2016_agentsshare where date between '" + datefrom + "' and '" + dateto + "' order by date");
	} else {
		query = client.query("SELECT * FROM vm2016_agentsshare order by date");
		datefrom = "all";
	}
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results : " + results);
		var html = "";
		if(results != null && results != ""){
		html = "<div style='float:left; width:50%'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke.jpg', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;, width:50%\">"
				+ "<h1>Shares Uploaded.</h1>";

		if(datefrom == 'all'){
			html += "<p>This report is listing all the shares uploaded:</p></div>"
		} else {
			html += "<p>This report is listing the shares uploaded between " + moment(datefrom).tz("America/New_York").format('YYYY-MM-DD') + " and " + moment(dateto).tz("America/New_York").format('YYYY-MM-DD') + "</p></div>"
		}
		html +="<table><tbody><tr style='color: white;background-color: #3d9dcb;'><td style='font-size: 12px;'>Agent</td><td style='font-size: 12px;'>Vendor</td><td style='font-size: 12px;'>Catalog#</td><td style='font-size: 12px;'>Location</td><td style='font-size: 12px;'>User</td><td style='font-size: 12px;'>Category</td><td>Date</td></tr>"
		
			for(var prop in results){
				var agent = results[prop].agent;
				var vendor = results[prop].vendor;
				var catalognumber = results[prop].catalognumber;
				var location = results[prop].location;
				var email = results[prop].email;
				var category = results[prop].category;
				var date = results[prop].date;


				html += " <tr><td style='font-size: 12px;'>" + agent + "</td>";
				html += " <td style='font-size: 12px;'>" + vendor + "</td>";
				html += " <td style='font-size: 12px;'>" + catalognumber + "</td>";
				html += " <td style='font-size: 12px;'>" + location + "</td>";
				html += " <td style='font-size: 12px;'>" + email + "</td>";
				html += " <td style='font-size: 12px;'>" + category + "</td>";
				html += " <td style='font-size: 12px;'>" + moment(date).tz("America/New_York").format('YYYY-MM-DD') + "</td></tr>";
		
			}
			html += "</tbody></table><p><i><b>The LabYoke Team.</b></i></p>";
		}
		
		callback(null, html)
	});
};

LabYokeReporter.prototype.reportOrders = function(callback) {
	var results;
	var datefrom = this.datefrom;
	var dateto = this.dateto;
	console.log("report on orders: datefrom: " + datefrom);
	console.log("report on orders: dateto: " + dateto);
	var query;
	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		query = client.query("SELECT * FROM vm2016_orders where date between '" + datefrom + "' and '" + dateto + "' order by date");
	} else {
		query = client.query("SELECT * FROM vm2016_orders order by date");
		datefrom = "all";
	}
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results : " + results);
		var html = "";
		if(results != null && results != ""){
		html = "<div style='float:left; width:50%'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke.jpg', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;, width:50%\">"
				+ "<h1>Orders Requested.</h1>";
		if(datefrom == 'all'){
			html += "<p>This report is listing all the orders requested:</p></div>"
		} else {
			html += "<p>This report is listing the orders requested between " + moment(datefrom).tz("America/New_York").format('YYYY-MM-DD') + " and " + moment(dateto).tz("America/New_York").format('YYYY-MM-DD') + "</p></div>"
		}
		html +="<table><tbody><tr style='color: white;background-color: #3d9dcb;'><td style='font-size: 12px;'>Agent</td><td style='font-size: 12px;'>Vendor</td><td style='font-size: 12px;'>Catalog#</td><td style='font-size: 12px;'>Owner</td><td style='font-size: 12px;'>Requestor</td><td>Date</td></tr>"
		
			for(var prop in results){
				var agent = results[prop].agent;
				var vendor = results[prop].vendor;
				var catalognumber = results[prop].catalognumber;
				var location = results[prop].email;
				var email = results[prop].requestoremail;
				var date = results[prop].date;


				html += " <tr><td style='font-size: 12px;'>" + agent + "</td>";
				html += " <td style='font-size: 12px;'>" + vendor + "</td>";
				html += " <td style='font-size: 12px;'>" + catalognumber + "</td>";
				html += " <td style='font-size: 12px;'>" + location + "</td>";
				html += " <td style='font-size: 12px;'>" + email + "</td>";
				html += " <td style='font-size: 12px;'>" + moment(date).tz("America/New_York").format('YYYY-MM-DD') + "</td></tr>";
		
			}
			html += "</tbody></table><p><i><b>The LabYoke Team.</b></i></p>";
		}
		
		callback(null, html)
	});
};

LabYokeAgents.prototype.findmyshares = function(callback) {
	var results = [];
	console.log("findmyshares: " + this.email);
	var query = client
			.query("SELECT * FROM vm2016_agentsshare where email='"
					+ this.email + "' order by date");
	var email = this.email;
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client
				.query("SELECT category, count(category) from vm2016_agentsshare group by category order by category asc");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);


			//results.push(result2.rows);

		var query4 = client
				.query("SELECT * from vm2016_orders where email='" + email
			+ "' order by date desc");
		query4.on("row", function(row, result4) {
			result4.addRow(row);
		});
		query4.on("end", function(result4) {

		var query3 = client
				.query("update vm2016_orders set status='' where status='new' and email='" + email
			+ "'");
		query3.on("row", function(row, result3) {
			result3.addRow(row);
		});
		query3.on("end", function(result3) {
			var test4 = result4.rows;
			results.push(test4.length);
			results.push(test4);
			console.log("orders findmyshares found: " + test4.length)
			callback(null, results)

		});


		});


			//callback(null, results)
		});
	});
};

LabYokeAgents.prototype.reportAllSharesByCategory = function(callback) {
	var results;
	console.log("reportAllSharesByCategory: " + this.email);
	var query = client
			.query("SELECT b.category, count(b.category) FROM vm2016_orders a, vm2016_agentsshare b where a.agent = b.agent group by b.category");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results)
	});
};

LabYokerOrder.prototype.order = function(callback) {
	var results;
	var agent = this.agent;
	var vendor = this.vendor;
	var catalognumber = this.catalognumber;
	var email = this.email;
	var sendemail = this.sendemail;
	var location = this.location;
	var now = moment(new Date).tz("America/New_York").format('YYYY-MM-DD');
	console.log("order location: " + location);
	var query = client.query("INSERT INTO vm2016_orders VALUES ('" + agent + "', '" + vendor + "', '" + catalognumber + "','" + email + "', '" + sendemail + "', '" + now + "', 'new')");

	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;

		var subject = "LabYoke Request - Order for " + agent;
		var body = "<div style='float:left'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke.jpg', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;\">Hello " + location
				+ ",<br/><br/>";
		body += "This is a kind request to share 100 units from the following inventory: <br><b>Agent: </b> " + agent;
		body += "<br><b>Vendor: </b> " + vendor;
		body += "<br><b>Catalog#: </b> " + catalognumber;
		body += "<br><b>Owner: </b> " + sendemail;
		body += "<p>Best regards,";
		body += "</p><b><i>The LabYoke Team.</i></b></div>";
		console.log("order body: " + body);

		var mailOptions = new MailOptionsWithCC(email, subject, body, sendemail);
		mailOptions.sendAllEmails();

		callback(null, "successfulOrder")
	});
};

LabYokerGetOrder.prototype.getorders = function(callback) {
	var results = [];
	var email = this.sendemail;
	console.log("getorders: " + email);
	var query = client
			.query("SELECT * FROM vm2016_orders where requestoremail like '%"
					+ email + "%' order by date desc");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client
				.query("SELECT b.category, count(b.category) FROM vm2016_orders a, vm2016_agentsshare b where a.agent = b.agent group by b.category");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);

		var query3 = client
				.query("SELECT count(agent) as counting from vm2016_agentsshare where email='" + email
			+ "' and status='new' ");
		query3.on("row", function(row, result3) {
			result3.addRow(row);
		});
		query3.on("end", function(result3) {
			//results.push(result2.rows);

		var query4 = client
				.query("update vm2016_orders set status='' where status='new' and requestoremail='" + email
			+ "'");
		query4.on("row", function(row, result4) {
			result4.addRow(row);
		});
		query4.on("end", function(result4) {
			//results.push(result2.rows);
			var test3 = result3.rows;

			results.push(test3[0].counting);
			console.log("shares found: " + test3[0].counting)
			callback(null, results)

		});



		});

			//callback(null, results)
		});
	});
};

LabYokeSearch.prototype.search = function(callback) {
	var results = [];
	console.log("searchText: " + this.searchText);
	var query = client
			.query("SELECT * FROM vm2016_agentsshare where lower(agent) like lower('%"
					+ this.searchText + "%') order by agent, location");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client.query("SELECT distinct agent FROM vm2016_agentsshare");
		
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);
				callback(null, results)
		});
		//callback(null, results)
	});
};

LabYokeSearch.prototype.findagents = function(callback) {
	var results;
	var query = client.query("SELECT distinct agent FROM vm2016_agentsshare");
	
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
			callback(null, results)
	});
};

//var crypt = require('bcrypt-nodejs');
var salt = crypt.genSaltSync(1);

Labyoker = function(username, password) {
	this.username = username;
	this.password = password;

};

LabYokeFinder.prototype.getLabyoker = function(callback) {
	var results;
	var query = client.query("SELECT * FROM vm2016_users where id='" + id
			+ "' and password='" + password + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
	});
};

LabYokeFinder.prototype.test = function(callback) {
	var results;
	var query = client.query("SELECT * FROM vm2016_users where id='"
			+ this.username + "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		callback(null, results);
	});
	// return false;
};

Labyoker.prototype.login = function(callback) {
	var password = this.password;
	var username = this.username;

	var results;
	var resultsLogin = [];
	var query = client.query("SELECT * FROM vm2016_users where id='" + username
			+ "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		if (results != null && results.length == 1) {

			var pass = results[0].password;
			var active = results[0].active;
			var email = results[0].email;
			console.log("email is: " + results[0].email);
			// var hash = crypt.hashSync(pass, salt);
			if (active == 1) {
				var c = crypt.compareSync(password, pass);
				if (c) {

		var query2 = client
				.query("SELECT count(agent) as counting from vm2016_orders where email='" + email
			+ "' and status='new'");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			//results.push(result2.rows);

		var query3 = client
				.query("SELECT count(agent) as counting from vm2016_orders where requestoremail='" + email
			+ "' and status='new'");
		query3.on("row", function(row, result3) {
			result3.addRow(row);
		});
		query3.on("end", function(result3) {
			//results.push(result2.rows);
			var test3 = result3.rows;
			var test2 = result2.rows;
			resultsLogin.push(results);
			resultsLogin.push(test2[0].counting);
			resultsLogin.push(test3[0].counting);
			console.log("shares found: " + test2[0].counting)
			console.log("orders found: " + test3[0].counting)
			callback(null, resultsLogin)
		});
			
		});

					//callback(null, results);
				} else {
					callback(null, null);
				}
			} else {
				var query = client
						.query("SELECT * FROM vm2016_users where id='"
								+ username + "' and password='" + password
								+ "'");
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on("end", function(result) {
					callback(null, result.rows);
				});
			}
		} else {
			callback(null, null);
		}
	});
};

LabyokerPasswordChange.prototype.checkIfChangePassword = function(callback) {
	var results;
	var now = moment(new Date).tz("America/New_York").format(
				'YYYY-MM-DD');
	var pwd = this.password;
	var query = client
			.query("SELECT * FROM vm2016_users where changepwd_id='"
					+ this.hash + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;

		if (results != null && results.length == 1){
			var changepwd_date = results[0].changepwd_date;
			if(changepwd_date != null) {
		
		console.log("now is " + now);
		console.log("changepwd_date is " + ( changepwd_date == now));
			/*var query2 = client.query("SELECT * FROM vm2016_users where changepwd_id='"
				+ this.id + "' and changepwd_date like '" + now + "'");
			*/
			if(now == results[0].changepwd_date){
			var email = results[0].email;
			var name = results[0].name;
			var userid = results[0].id;

			/*query2.on("row", function(row, result2) {
				result2.addRow(row);
			});
			query2.on("end", function(result2) {
				results2 = result2.rows;
				if (results2 != null && results2.length == 1) {*/
					console.log("changing password now for: " + name);
					console.log("changing password pwd: " + pwd);
					var hash_new_password = crypt.hashSync(pwd);
					console.log("test0 " + hash_new_password);
					var query3 = client.query("UPDATE vm2016_users SET password='" + hash_new_password
							+ "', active=1, changepwd_date='', changepwd_status=1, changepwd_id='' where id='" + userid + "'");
					console.log("test1");
					query3.on("row", function(row, result3) {
						result3.addRow(row);
						console.log("test2");
					});
					console.log("changing password pwd: " + pwd);
					query3.on("end", function(result3) {
						var results3 = result3.rows;
						if (results3 != null) {
							var results3 = result3.rows;
							callback(null, "passwordReset");
						} else {
							callback(null, "errorFound");
						}
					});
				} else {
					callback(null, "dateExpired");
				}
			//});
		} else {
			callback(null, "cannotFindRequest");
		}
	}
	});
}

LabyokerRegister.prototype.register = function(callback) {
	var username = this.username;
	var password = this.password;
	var lab = this.lab;
	var firstname = this.firstname;
	var lastname = this.lastname;
	var email = this.email;
	var tel = this.tel;

	var results;
	//var check = 

			console.log("labyoker username: " + username);
			console.log("labyoker password: " + password);
			console.log("labyoker lab: " + lab);
			console.log("labyoker firstname: " + firstname);
			console.log("labyoker lastname: " + lastname);
			console.log("labyoker email: " + email);
			console.log("labyoker tel: " + tel);

	if(tel != null && tel.length>0 && username != null && username.length>0 && firstname != null && firstname.length>0 && lastname != null && lastname.length>0 && email != null && email.length>0 && password != null && password.length>0 && lab != null && lab.length>0 ){
	console.log("processing registration2...");
	//var query = client.query("SELECT * FROM vm2016_users where id='" + username
	//		+ "'"/* and password='"+password+"'" */);
	/*query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("email entered: " + email);
		if (results != null && results.length > 0) {
			
			for (i = 0; i < results.length; i++) { 
				console.log("results[i].email: " + results[i].email);
				if(results[i].email == email){
					console.log("in use?: alreadyInUse");
					callback(null, "alreadyInUse");
				}
			}

		} else {*/
			var hash = crypt.hashSync(password);
			var query2 = client.query("INSERT INTO vm2016_users VALUES ('" + username
				+ "', '" + hash + "', '" + firstname + "',  1, null, null, '" + email + "', null, '" + lab + "', '" + lastname + "', '" + tel + "', 0)");

				query2.on("row", function(row, result2) {
					result2.addRow(row);
				});
				query2.on("end", function(result2) {

					
					console.log("email: " + email);

					/*if (email.length == 4 || email.length == 2) {
						email += "@netlight.com";
					}*/
					var subject = "Labyoke - Start Labyoking";
					var body = "<div style='float:left'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke.jpg', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;\">Hello " + firstname
							+ ",<br/><br/>";
					body += "Thanks for registering with @LabYoke.";
					body += "<p>[PS: Start <a href=\"https:\/\/team-labyoke.herokuapp.com\/share\">sharing</a> some chemicals today?]";
					body += "</p><b><i>The LabYoke Team.</i></b></div>";
					console.log("body: " + body);

					var mailOptions = new MailOptions(email, subject, body);
					mailOptions.sendAllEmails();

					callback(null, "success");

				});
				
		//}
	//});
} else if(tel != null && tel.length>0 && firstname != null && firstname.length>0 && lastname != null && lastname.length>0 && email != null && email.length>0 ){
	var rendered = false;
	console.log("processing registration...");
	var query = client.query("SELECT * FROM vm2016_users where email='" + email
			+ "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("email entered: " + email);
		if (results != null && results.length > 0) {
			
			//for (i = 0; i < results.length; i++) { 
				console.log("results[0].email: " + results[0].email);
				if(results[0].email == email){
					rendered = true;
					console.log("in use?: alreadyInUse");
					callback(null, "alreadyInUse");
				}
			//}

		}
		console.log("rendered: " + rendered);
		if(!rendered){
			callback(null, "firstsection");
		}
	});

} else {
	callback(null, null);
}
};

Labyoker.prototype.requestChangePassword = function(callback) {
	var username = this.username;
	var dateStripped = this.password;

	var results;
	var query = client.query("SELECT * FROM vm2016_users where id='" + username
			+ "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("dateStripped: " + dateStripped);
		if (results != null && results.length == 1 && dateStripped != null) {
			var changepwd_status = results[0].changepwd_status;
			var now = moment(new Date).tz("America/New_York").format(
				'YYYY-MM-DD');
			var changepwd_date = results[0].changepwd_date;
			console.log("diff: " + changepwd_date + " - " + now);
			if(changepwd_date == null || (changepwd_date != null && changepwd_date=='') || (changepwd_date != null && changepwd_date!=now)){
				var hash = crypt.hashSync(username);
				console.log("before requestChangePassword: " + hash);
				hash = hash.replace(/\//g, "");
				console.log("requestChangePassword: " + hash);
				var query2 = client.query("UPDATE vm2016_users SET changepwd_id='" + hash
				+ "', changepwd_status=0, changepwd_date='" + dateStripped + "' where id='" + username + "'");
				
				var email = results[0].email;
				var name = results[0].name;

				query2.on("row", function(row, result2) {
					result2.addRow(row);
				});
				query2.on("end", function(result2) {

					
					console.log("email: " + email);

					/*if (email.length == 4 || email.length == 2) {
						email += "@netlight.com";
					}*/
					var subject = "Labyoke - Change Password Request";
					var body = "<div style='float:left'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke.jpg', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;\">Hello " + name
							+ ",<br/><br/>";
					body += "You have requested to change your password @LabYoke. Please click on this link:<br/>";
					body += "<p style=\"text-align:center\"><span style=''><b><a href='https:\/\/team-labyoke.herokuapp.com\/changepassword/"
							+ hash + "'>https:\/\/team-labyoke.herokuapp.com\/changepassword?id="
							+ hash
							+ "</a></b></span></p>";
					body += "<p><span>You have <b><span style='color:red;'>1 day</span>"
							+ "</b> to change your password. But don't worry you can always send us another <a href=\"https:\/\/team-labyoke.herokuapp.com\/forgot\">request</a> once this one has expired.</span> </p>";
					body += "<p>[PS: Have you <a href=\"https:\/\/team-labyoke.herokuapp.com\/share\">shared</a> some chemicals today?]";
					body += "</p><b><i>The LabYoke Team.</i></b></div>";
					console.log("body: " + body);

					var mailOptions = new MailOptions(email, subject, body);
					mailOptions.sendAllEmails();

				});
				callback(null, results);
			} else {
				//Change Password already sent
				console.log("alreadySent.");
				callback(null, "alreadySent");
			}
		} else {
			callback(null, null);
		}
});
};

Labyoker.prototype.changepassword = function(callback) {
	var hash = crypt.hashSync(this.password);
	var results;
	var query = client.query("UPDATE vm2016_users SET password='" + hash
			+ "', active=1 where id='" + this.username + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
	});
};

var analyze = function(matchresults, participantsResults) {
	for (var i = 0; i < participantsResults.length; i++) {
		var participant = participantsResults[i];
		var points = 0;
		var matchmargin = matchresults.scoretyp - matchresults.scorehemma;
		var participantmargin = participant.scoretyp - participant.scorehemma;
		var predictedteam = participant.predictedteam;
		var winner = matchresults.winner;

		if (predictedteam != winner) {
			points = 0;
		} else if (participant.scoretyp == matchresults.scoretyp
				&& participant.scorehemma == matchresults.scorehemma) {
			points = 6;
		} else if (predictedteam == winner && matchmargin == participantmargin
				&& matchresults.scorehemma != matchresults.scoretyp) {
			points = 4;
		} else if (predictedteam == winner
				|| (participant.scoretyp == matchresults.scoretyp && participant.scorehemma == matchresults.scorehemma)) {
			points = 3;
		}

		var email = participant.id;

		if (email.length == 4 || email.length == 2) {
			email += "@netlight.com";
		}
		var subject = "Your Prediction Results for - " + matchresults.typ
				+ " v " + matchresults.hemma;
		var body = "<div style=\"font-family:'calibri'; font-size:11pt\">Hello There,<br/><br/>";
		body += "Thanks for participating in the BrazilianLight tournament! Here is the result of the game:<br/>";
		body += "<p style=\"text-align:center\"><span style='font-size:20pt'><b>"
				+ matchresults.typ
				+ "</b></span> <span style='color:red; font-size:18pt'><b>"
				+ matchresults.scoretyp + "</b></span>";
		body += " v " + "<span style='color:red; font-size:18pt'><b>"
				+ matchresults.scorehemma
				+ "</b></span> <span style='font-size:20pt'><b>"
				+ matchresults.hemma + "</b></span></p>";
		body += "You predicted the score to be <b>" + participant.scoretyp
				+ ":" + participant.scorehemma + "</b>.";
		body += "<br/>You have earned: <span style='color:red'><b>" + points
				+ " points</b></span>.";
		body += "<br/><br/>Have you played today? Come and play with us again <a href=\"http:\/\/labyoke@gmail.com\">@BrazilianLight</a>";
		body += "<br/><br/><b><i>The BrazilianLight Team -</i></b></div>";

		var mailOptions = new MailOptions(email, subject, body);
		mailOptions.sendAllEmails();

		var results;
		var queryString = "UPDATE vm2014_predictsingleteam SET points = "
				+ points + " where bet = " + matchresults.bet + " and id = '"
				+ participant.id + "'";
		var query = client.query(queryString);
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			results = result.rows;
			return results;
		});
	}
}

exports.Labyoker = Labyoker;
exports.LabYokeReporter = LabYokeReporter;
exports.LabYokeAgents = LabYokeAgents;
exports.LabYokeSearch = LabYokeSearch;
exports.LabyokerRegister = LabyokerRegister;
exports.LabYokerGetOrder = LabYokerGetOrder;
exports.LabYokerOrder = LabYokerOrder;
exports.LabYokeFinder = LabYokeFinder;
exports.LabYokeUploader = LabYokeUploader;
exports.LabyokerPasswordChange = LabyokerPasswordChange;
