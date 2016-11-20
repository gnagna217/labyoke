var labyokeFinderClass = require('./labyokerfinder');
var dates = require('../config/staticvariables');


var LabYokerOrder = labyokeFinderClass.LabYokerOrder;
var LabYokeReporter = labyokeFinderClass.LabYokeReporter;
var LabYokerGetOrder = labyokeFinderClass.LabYokerGetOrder;
var LabyokerPasswordChange = labyokeFinderClass.LabyokerPasswordChange;
var LabyokerRegister = labyokeFinderClass.LabyokerRegister;
var LabYokeFinder = labyokeFinderClass.LabYokeFinder;
var LabYokeUploader = labyokeFinderClass.LabYokeUploader;
var Labyoker = labyokeFinderClass.Labyoker;
var LabYokeAgents = labyokeFinderClass.LabYokeAgents;
var moment = require('moment-timezone');

var express = require('express');
var router = express.Router();

var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

//var fs = require('fs');
//html-pdf

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');


module.exports = function(router) {

	var competitionStarts = dates.competitionStarts;
	var competitionEnds = dates.competitionEnds;

    router.post('/share', isLoggedIn, function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    //var ob = { data:result};
                    console.log("is admin? " + isLoggedInAdmin);
                    var labYokeUploader = new LabYokeUploader(result);
                    labYokeUploader.upload(function(error, done) {
                    res.render('share', {
                    json: result, loggedIn : true, isLoggedInAdmin: isLoggedInAdmin, title: 'Share', spreadname: req.file.originalname
                    });
                });
                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        })
    });


	router.get('/', function(req, res) {
		res.redirect('/search');
	});

	router.get('/help', /*isLoggedIn,*/ function(req, res) {
		res.render('help', {
			title : 'Help',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
			menu : 'help',
			title: 'Help'
		});

	});

	router.get('/logout', function(req, res) {
		req.logout();
		req.session.user = null;
		req.session.loggedin = false;
		res.redirect('/login');
	});

	function isLoggedIn(req, res, next) {
		if (req.session.user)
			return next();
		res.redirect('/login');
	}
	function isLoggedInAdmin(req, res, next) {
		if (req.session.user && req.session.useradmin)
			return next();
		res.redirect('/search');
	}

	function isLoggedInAndNotActive(req, res, next) {
		if (req.session.active != null && req.session.active == 0)
			return next();
		res.redirect('/');
	}

	function isAdmin(req, res, next) {
		if (req.session.userid == 'algo' || req.session.userid == 'amjw'
				|| req.session.userid == 'mkon')
			return next();
		res.redirect('/');
	}

	router.get('/login', function(req, res) {
		if (req.session.user) {
			res.redirect('/search');
		} else {
			res.render('login', {title: 'Login'});
			req.session.messages = null;

		}
	});

	router.get('/search', function(req, res) {
		if (req.session.user) {
			var labYokeSearch = new LabYokeSearch("");
			labYokeSearch.findagents(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('search', {agentsResults : results, loggedIn : true, title: 'Search'});
				} else {
					res.render('search', {loggedIn : true, title: 'Search'});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	router.get('/orders', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var labYokerGetOrder = new LabYokerGetOrder(req.session.email);
			labYokerGetOrder.getorders(function(error, results) {
				if(results != null){
					console.log("orders results: " + results);				
					res.render('orders', {title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1]});
					//req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/orders', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var agent = req.body.agentform;
			var vendor = req.body.vendorform;
			var catalognumber = req.body.catalogform;
			var email = req.body.emailform;
			var location = req.body.locationform;
			var reqemail = req.session.email;
			var labYokerorder = new LabYokerOrder(agent, vendor, catalognumber,email,location,reqemail);
			labYokerorder.order(function(error, results) {
				if(results != null && results=="successfulOrder"){
					console.log("ordering agentform: " + agent);
					console.log("ordering location: " + location);
					console.log("ordering reqemail: " + reqemail);
				
					res.render('orders', {title:'Orders',loggedIn : true, location: location, agent: agent, vendor: vendor, catalog: catalognumber, email: email});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.get('/account', isLoggedIn, function(req, res) {
		res.render('account', {loggedIn : true, title: 'Account'});
		req.session.messages = null;
	});

	router.get('/reports', isLoggedIn, function(req, res) {
		res.render('reports', {loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
		req.session.messages = null;
	});

	router.post('/reportSomething', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var agent = req.body.agentform;
			var vendor = req.body.vendorform;
			var catalognumber = req.body.catalogform;
			var email = req.body.emailform;
			var location = req.body.locationform;
			var reqemail = req.session.email;
			var labYokereporter = new LabYokeReporter("datefrom", "dateto");
			labYokereporter.reportSomething(function(error, results) {
				if(results != null){
					var options = { format: 'Letter' };
					console.log("res " + results);
					res.render('reports', {title:'Reports',loggedIn : true, results: results, isLoggedInAdmin: req.session.admin});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.get('/play', function(req, res) {
		res.render('play', {title: 'Play'});
		req.session.messages = null;
	});

	router.get('/share', isLoggedIn, function(req, res) {
		var labYokeAgents = new LabYokeAgents(req.session.email);
		labYokeAgents.findmyshares(function(error, results) {
			console.log("is admon? " + req.session.admin);
			res.render('share', {myshares: results[0], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/forgot', function(req, res) {
		res.render('forgot', {title: 'Forgot Password'});
		req.session.messages = null;
	});

	router.post('/forgot', function(req, res) {
			var forgotuser = req.body.forgotuser;
			if (forgotuser != null && forgotuser.length > 0){
				var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD');
				console.log("dateStripped2: " + dateStripped);
				var labyoker = new Labyoker(forgotuser,dateStripped);
				labyoker.requestChangePassword(function(error, done) {
					console.log("done: " + (done != null && done.length > 0 && done == 'alreadySent'));
					console.log("done2: " + (done != null && done == 'alreadySent'));
					if (done != null && done.length > 0 && done != 'alreadySent') {
						res.render('forgot', {userfound : forgotuser});
					} else if(done != null && done.length > 0 && done == 'alreadySent') {
						res.render(
							'forgot',
							{
								title: 'Forgot Password', message : "Ah. We have already sent you an email today to change your password. Please check your inbox.", usernotfound : true, noforgotform: true
							});
					} else {
						res.render(
							'forgot',
							{
								title: 'Forgot Password', message : "Sorry. We could not find an account with this username. Please try again below.", usernotfound : true
							});
					}
				});
			} else {
				res.render(
					'forgot',
					{
						title: 'Forgot Password', message : "Sorry. You must enter your current username. Please try again below.", usernotfound : true
					});

			}
			//req.session.messages = null;
	});

	router.get('/register', function(req, res) {
		res.render('register', {title: 'Register'});
		req.session.messages = null;
		req.body.reglab = null;
	});

	router.post('/register', function(req, res) {
		var rendered = false;
		var lab = req.body.reglab;
		var user = req.body.reguser;
		var user_pwd = req.body.regpass;

		var user_name = req.body.regfirstname;
		var user_surname = req.body.reglastname;
		var user_email = req.body.regemail;
		var user_tel = req.body.regtel;

		if (user && user_name && user_pwd && lab && user_surname && user_email && user_tel) {
			console.log("second section processing...");
			console.log("user: " + user);
			console.log("user_pwd: " + user_pwd);
			console.log("lab: " + lab);
			console.log("user_name: " + user_name);
			console.log("user_surname: " + user_surname);
			console.log("user_email: " + user_email);
			console.log("user_tel: " + user_tel);
			var labyokerRegister = new LabyokerRegister(user,user_pwd,lab,user_name,user_surname,user_email,user_tel);
			/*var regfirstname = req.body.regfirstname;
			console.log("regfirstname entered " + regfirstname);
			if (regfirstname != null && regfirstname.length > 0){
				req.session.user = regfirstname;
				res.render('register', {regsuccess : regfirstname, loggedIn : true});
			} else {
				res.render('register', {});
			}*/
			labyokerRegister.register(function(error, done) {
				console.log("done: " + done);
				if(done != null && done.length > 0 && done == 'firstsection') {
					console.log("status = firstsection1");
					rendered = true;
					res.render(
						'register',
						{
							labentered : true,
							firstname: req.session.firstname,
							lastname: req.session.lastname,
							email: req.session.email,
							tel: req.session.tel,
							title: 'Register'
						});
				} else if (done != null && done.length > 0 && done != 'success') {
					console.log("status = status1");
					res.render('register', {title: 'Register', message : "Sorry. We could not register you. Please try again below."});
				} else if(done != null && done.length > 0 && done == 'success') {
					console.log("status = success1");
					rendered = true;
					console.log("successfully registered " + user_name);
					res.render(
						'register',
						{
							regsuccess : user_name,
							labentered : false,
							title: 'Register'
						});
				} else {
					res.render(
						'register',
						{
							message : "Sorry. You cannot proceed. Please try again below.",
							title: 'Register'
						});
				}
			});
			rendered = true;
		} else if (user_name && user_surname && user_email && user_tel) {
				console.log("first section processing...");
				var labyokerRegister = new LabyokerRegister(null,null,null,user_name,user_surname,user_email,user_tel);;
				req.session.firstname = user_name;
				req.session.lastname = user_surname;
				req.session.email = user_email;
				req.session.tel = user_tel;
				labyokerRegister.register(function(error, done) {

					if(done != null && done.length > 0 && done == 'alreadyInUse') {
						console.log("status = alreadyInUse");
						rendered = true;
						res.render('register', {title: 'Register', message : "Sorry. This email address is already in use. Please use a different one and try again below."});
					} else if(done != null && done.length > 0 && done == 'firstsection') {
						console.log("status = firstsection");
						rendered = true;
						res.render(
							'register',
							{
								labentered : true,
								firstname: req.session.firstname,
								lastname: req.session.lastname,
								email: req.session.email,
								tel: req.session.tel,
								title: 'Register'
							});
					} else if(done != null && done.length > 0 && done != 'success') {
						console.log("status = not successful");
						rendered = true;
						res.render('register', {title: 'Register', message : "Sorry. We could not register you. Please try again below."});
					} else if(done != null && done.length > 0 && done == 'success') {
						console.log("status = success");
						rendered = true;
						res.render(
							'register',
							{
								regsuccess : user_name,
								labentered: false,
								title: 'Register'
							});
					} else {
						console.log("status = something else happened");
						rendered = true;
						res.render(
							'register',
							{
								message : "Sorry. You cannot proceed. Please try again below.",
								title: 'Register'
							});
					}
					if(!rendered){
						console.log("nothing entered");
						res.render('register', {message : "Sorry. We could not register you. Please fill out all fields below.", title: 'Register'});
					}
				});
			}
	});

	router.post('/search', function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchText;
			var labYokeSearch = new LabYokeSearch(searchText);
			labYokeSearch.search(function(error, results) {			
				if (searchText != null && searchText.length > 0){
					res.render('search', {title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformText: searchText, loggedIn : true});
				} else {
					res.render('search', {title: 'Search', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});


	router
			.post(
					'/login',
					function(req, res) {
						var username = req.body.user;
						var password = req.body.pass;
						if (username != null && username.length > 0
								&& password != null && password.length > 0) {
							var labyoker = new Labyoker(username, password);

							labyoker
									.login(function(error, done) {

										if (done != null && done.length > 0) {
											req.session.user = done[0].name;
											req.session.userid = done[0].id;
											console.log("admin? " + done[0].admin);
											req.session.admin = done[0].admin;
											req.session.active = done[0].active;
											req.session.email = done[0].email;
											req.session.fullname = done[0].name;
											console.log("fullname " + req.session.fullname);
											console.log("email " + req.session.email);
											if (done[0].active == 0) {

												return res
														.redirect('/changepassword');
											}
req.session.loggedin = true;
											res.redirect('/search');
										} else {
											res
													.render(
															'login',
															{
																message : "Your username and/or password is wrong. Please try again... Or <a href='mailto:labyoke@gmail.com?Subject="
																		+ username
																		+ " - Forgot Password' target='_top'>Contact us</a> to retrieve it.", title: 'Login'
															});
										}
									});
						} else {
							res
									.render(
											'login',
											{
												message : "Your username and/or password is wrong. Please try again... Or <a href='mailto:labyoke@gmail.com?Subject="
														+ username
														+ " - Forgot Password' target='_top'>Contact us</a> to retrieve it.", title: 'Login'
											});
						}

					});

	router.get('/changepassword/:id', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.render('changepassword', {
			title : 'Change Password',
			/*loggedIn : true,*/
			displayForm: true,
			hashid: req.params.id,
			scripts : [ '/javascripts/utils.js' ]
		});
	});

	router.get('/changepassword', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.redirect('/forgot');
	});

	router.post('/changepassword', /*isLoggedIn,*/ function(req, res) {
		/*labyoker.changepassword(function(error, done) {
			if (done != null) {
				res.redirect('/');
			}
		});*/
		var id = req.body.hashid;
		console.log("changing password id is: " + id);
		console.log("changing password pwd is: " + req.body.pass);
		var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD'); // '2014-06-09'

		if (id != null && id.length > 0){
			var pwdChange = new LabyokerPasswordChange(id, req.body.pass);
			pwdChange.checkIfChangePassword(function(error, results) {
			
			console.log("LabyokerPasswordChange results: " + results);
			
			if (results != null && results.length > 0 && results == 'passwordReset') {
					res.render('changepassword', {
						title : 'Change Password',
						/*loggedIn : true,*/
						messageSuccess : "Congratulations you have successfully changed your Password. Please head to the <a href='/login'>login</a> page.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('changepassword', {
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						message : "An error was found while processing your change password. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'dateExpired') {
						res.render('forgot', {
						title : 'Change Password',
						/*loggedIn : true,*/
						message : "Unfortunately your Change Password request has expired. Please make a new request.", 
						displayForm: true,
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
					res.render('forgot', {
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						message : "Sorry we could not find your Change Password request. Please make a new request.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else {
					res.render('changepassword', {
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						message : "An error was found while processing your change password. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
		} else {
			console.log("redirecting to forgot page");
			res.redirect('/forgot');
		}

	});



};
