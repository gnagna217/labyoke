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
var LabyokerUserDetails = labyokeFinderClass.LabyokerUserDetails;
var LabYokerChangeShare = labyokeFinderClass.LabYokerChangeShare;
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
                    ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: isLoggedInAdmin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user
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
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Help',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
			isLoggedInAdmin: req.session.admin,
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
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("loggin in labs: " + labs);
				res.render('login', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title: 'Login',isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			});

		}
	});

	router.get('/search', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var labYokeSearch = new LabYokeSearch("",req.session.email);
			labYokeSearch.findagents(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('search', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, agentsResults : results, loggedIn : true, title: 'Search'});
				} else {
					res.render('search', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Search'});
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
				labYokerGetOrder.getLabOrders_2(function(error, results2) {
				if(results != null){
					//req.session.shares = results[2];
					//req.session.orders = 0;
					console.log("orders results: " + results[0]);
					console.log("lab orders results0: " + results2);	
					//console.log("lab orders results1: " + results2[1]);				
					//res.render('orders', {test: results[3], laborders: results2[0],lab1orders: results2[1], ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1]});
					res.render('orders', {test: results[3], laborders: results2, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1]});
				}
			});
				});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/orders', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var agent = req.body.agentform;
			var lab = req.body.labform;
			var vendor = req.body.vendorform;
			var catalognumber = req.body.catalogform;
			var email = req.body.emailform;
			var location = req.body.locationform;
			var reqemail = req.session.email;
			var reqcategory = req.body.categoryform;
			var quantity = req.body.qtyform;
			var labYokerorder = new LabYokerOrder(lab, agent, vendor, catalognumber,email,location,reqemail,reqcategory,quantity);
			labYokerorder.order(function(error, results) {
				if(results != null && results=="successfulOrder"){
					console.log("ordering agentform: " + agent);
					console.log("ordering location: " + location);
					console.log("ordering reqcategory: " + reqcategory);
				
					res.render('orders', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders',loggedIn : true, location: location, agent: agent, vendor: vendor, catalog: catalognumber, email: email});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/cancelshare', isLoggedIn, function(req, res) {
		if (req.session.user) {
			var agent = req.body.agent;
			var vendor = req.body.vendor;
			var catalognumber = req.body.catalognumber;
			var table = req.body.table;
			var email = req.body.email;
			var requestor = req.body.requestoremail;
			var checked = req.body.cancel;
			var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
				'YYYY-MM-DD');
			var datenow = moment(new Date).tz("America/New_York").format(
				'YYYY-MM-DD');
			if(checked != null)
				checked = 0;
			if(checked == undefined)
				checked = 1;
			console.log("date: " + date);
			console.log("agent: " + agent);
			console.log("vendor: " + vendor);
			console.log("catalognumber: " + catalognumber);
			console.log("checked: " + checked);
			console.log("table: " + table);
			console.log("email: " + email);
			console.log("requestoremail: " + requestor);
			var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date);
			labYokechange.cancelShare(function(error, results) {
				if(results != null && results.length > 0){
					res.redirect('/share');			
					//res.render('share', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});


	router.get('/reports', isLoggedIn, function(req, res) {
		res.render('reports', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
		req.session.messages = null;
	});

	router.post('/reportShares', isLoggedIn, function(req, res) {
		var datefrom = req.body.reportDateFrom;
		var dateto = req.body.reportDateTo;
		console.log("reportSomething " + req.body.reportDateFrom);
		var labYokereporter = new LabYokeReporter(datefrom, dateto);
		labYokereporter.reportShares(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results != ""){
					res.render('reports', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromShares: datefrom, dateto: dateto, title:'Reports',loggedIn : true, resultsShares: results, isLoggedInAdmin: req.session.admin, addMessageShares: "success"});
				} else {
					res.render('reports', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromShares: datefrom, dateto: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageShares: "failure"});
				}
				req.session.messages = null;
			}
		});
	});



	router.post('/changeDetails', isLoggedIn, function(req, res) {
		var col = req.body.column;
		var val = req.body.valuedetail.replace("'","");
		var email = req.body.formemail;
		console.log("changeDetails col: " + col);
		console.log("changeDetails val: " + val);
		console.log("changeDetails email: " + email);
		if(col == 'name'){
			req.session.user = val;
		}
		var labYokedetails = new LabyokerUserDetails(col, val, email);
		labYokedetails.changeDetails(function(error, results) {
			if(results){
				console.log("res changeDetails " + results);
				res.render('account', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});
	});

	router.post('/reportOrders', isLoggedIn, function(req, res) {
		var datefrom = req.body.reportDateFromOrders;
		var dateto = req.body.reportDateToOrders;
		console.log("reportOrders " + req.body.reportDateFromOrders);
		var labYokereporter = new LabYokeReporter(datefrom, dateto);
		labYokereporter.reportOrders(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results != ""){
					res.render('reports', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, resultsOrders: results, isLoggedInAdmin: req.session.admin, addMessageOrders: "success"});
				} else {
					res.render('reports', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageOrders: "failure"});
				}
				req.session.messages = null;
			}
		});
	});

	router.get('/play', function(req, res) {
		res.render('play', {ordersnum: req.session.orders, sharesnum: req.session.shares, title: 'Play',labyoker : req.session.user});
		req.session.messages = null;
	});

	router.get('/share', isLoggedIn, function(req, res) {
		var labYokeAgents = new LabYokeAgents(req.session.email);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
			res.render('share', {test: results[4], ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/account', isLoggedIn, function(req, res) {
		console.log("inside accounnt: " + req.session.email);
		var labYokeAgents = new LabYokeAgents(req.session.email);
		labYokeAgents.getLabyoker(function(error, results) {
			res.render('account', {userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
			req.session.messages = null;
		});
	});
	

	router.get('/forgot', function(req, res) {
		res.render('forgot', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password'});
		req.session.messages = null;
	});

	router.post('/forgot', function(req, res) {
			var forgotuser = req.body.forgotuser;
			if (forgotuser != null && forgotuser.length > 0){
				var dateStripped = moment(new Date).tz("America/New_York").format(
				'YYYY-MM-DD');
				console.log("dateStripped2: " + dateStripped);
				var labyoker = new Labyoker(forgotuser,dateStripped);
				labyoker.requestChangePassword(function(error, done) {
					console.log("done: " + (done != null && done.length > 0 && done == 'alreadySent'));
					console.log("done2: " + (done != null && done == 'alreadySent'));
					if (done != null && done.length > 0 && done != 'alreadySent') {
						res.render('forgot', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, userfound : forgotuser});
					} else if(done != null && done.length > 0 && done == 'alreadySent') {
						res.render(
							'forgot',
							{
								ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : "Ah. We have already sent you an email today to change your password. Please check your inbox.", usernotfound : true, noforgotform: true
							});
					} else {
						res.render(
							'forgot',
							{
								ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : "Sorry. We could not find an account with this username. Please try again below.", usernotfound : true
							});
					}
				});
			} else {
				res.render(
					'forgot',
					{
						ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : "Sorry. You must enter your current username. Please try again below.", usernotfound : true
					});

			}
			//req.session.messages = null;
	});

	router.get('/register', function(req, res) {
			console.log("register labs: " + req.session.labs);
			res.render('register', {ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register'});
			req.session.messages = null;
			req.body.reglab = null;
	});

	router.get('/reportShares', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportOrders', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/cancelshare', function(req, res) {
		res.redirect('/share');
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

		const util = require('util');
		var labs = req.session.labs;
		for(var i in labs){
			var labrow = util.inspect(labs[i], false, null);
       		//var lab = labs[i].lab
       		console.log("i is: "+ i);
       		console.log("lab util: " + labrow);
       		console.log("labrow lab util: " + labrow.lab);
       		
       			//console.log("lab is: "+ lab);
       	}

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
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							labentered : true,
							firstname: req.session.firstname,
							lastname: req.session.lastname,
							email: req.session.email,
							tel: req.session.tel,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
							labs: req.session.labs
						});
				} else if (done != null && done.length > 0 && done != 'success') {
					console.log("status = status1");
					res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register', message : "Sorry. We could not register you. Please try again below."});
				} else if(done != null && done.length > 0 && done == 'success') {
					console.log("status = success1");
					rendered = true;
					console.log("successfully registered " + user_name);
					res.render(
						'register',
						{
							ordersnum: req.session.orders,
							sharesnum: req.session.shares, 
							regsuccess : user_name,
							labentered : false,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
							labs: req.session.labs
						});
				} else {
					res.render(
						'register',
						{
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							message : "Sorry. You cannot proceed. Please try again below.",
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
							labs: req.session.labs
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
						res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register', message : "Sorry. This email address is already in use. Please use a different one and try again below."});
					} else if(done != null && done.length > 0 && done == 'firstsection') {
						console.log("status = firstsection");
						rendered = true;
						res.render(
							'register',
							{
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								labentered : true,
								firstname: req.session.firstname,
								lastname: req.session.lastname,
								email: req.session.email,
								tel: req.session.tel,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
								labs: req.session.labs
							});
					} else if(done != null && done.length > 0 && done != 'success') {
						console.log("status = not successful");
						rendered = true;
						res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Register', message : "Sorry. We could not register you. Please try again below."});
					} else if(done != null && done.length > 0 && done == 'success') {
						console.log("status = success");
						rendered = true;
						res.render(
							'register',
							{
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								regsuccess : user_name,
								labentered: false,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
								labs: req.session.labs
							});
					} else {
						console.log("status = something else happened");
						rendered = true;
						res.render(
							'register',
							{
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								message : "Sorry. You cannot proceed. Please try again below.",
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
								labs: req.session.labs,
							});
					}
					if(!rendered){
						console.log("nothing entered");
						res.render('register', {labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, message : "Sorry. We could not register you. Please fill out all fields below.", title: 'Register'});
					}
				});
			} else {
				res.render(
				'register',
				{
					ordersnum: req.session.orders,
					sharesnum: req.session.shares, 
					message : "Sorry. You cannot proceed. Please try again below.",
					title: 'Register',
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
					labs: req.session.labs
				});
			}
	});

	router.post('/search', function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchText;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email);
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);	
				if (searchText != null && searchText.length > 0){
					res.render('search', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformText: searchText, loggedIn : true});
				} else {
					res.render('search', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Search', loggedIn : true, agentsResults : results[1]});
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
									.login(function(error, results) {
										var done, shares, orders;

										if(results != null && results.length > 0){
											done = results[0];
										}
										
										/*if(results != null && results.length > 2){
											orders = results[2];
											req.session.orders = orders;
										}*/
										console.log("done is " + done);
										//console.log("done2 is " + done.length);
										console.log("shares is " + shares);
										console.log("orders is " + orders);

										if (done != null && done.length > 0) {
											if (done[0].active == 0) {

												return res
														.render(
															'login',
															{
																message : "You have not completed your registration. Please check your emails and click on the link.", title: 'Login'
															});
											}

											var init = new LabyokerInit(done[0].email);
											init.initialShares(function(error, resultsShares) {
												console.log("inside init shares " + resultsShares);
												if(resultsShares != null){
													console.log("initshares is " + resultsShares);
													shares = resultsShares;
													req.session.shares = shares;
												}
												init.initialOrders(function(error, resultsOrders) {
													console.log("inside init orders " + resultsOrders);
													if(resultsOrders != null){
														console.log("initorders is " + resultsOrders);
														orders = resultsOrders;
														req.session.orders = orders;
													}
													req.session.user = done[0].name;
													req.session.userid = done[0].id;
													console.log("admin? " + done[0].admin);
													req.session.admin = done[0].admin;
													req.session.active = done[0].active;
													req.session.email = done[0].email;
													req.session.fullname = done[0].name;
													console.log("fullname " + req.session.fullname);
													console.log("email " + req.session.email);
													req.session.loggedin = true;
													res.redirect('/search');
												});
											});
										} else {
											res
													.render(
															'login',
															{
																message : "Your username and/or password is wrong. Please try again.", title: 'Login'
															});
										}
									});
						} else {
							res
									.render(
											'login',
											{
												message : "Your username and/or password is wrong. Please try again.", title: 'Login'
											});
						}

					});

	router.get('/confirmreg', function(req, res) {
		res.redirect('/register');
	}); 

	router.get('/confirmreg/:id', function(req, res) {

		var id = req.params.id;
		console.log("confirm register id is: " + id);

		if (id != null && id.length > 0){
			var confirmReg = new LabyokerConfirm(id);
			confirmReg.confirm(function(error, results) {
			
			console.log("LabyokerConfirm results: " + results);
			
			if (results != null && results.length > 0 && results == 'confirmReset') {
					res.render('register', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						messageSuccess : "Congratulations you have successfully registered. You can now start searching to the <a href='/search'>search</a> page.",
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('register', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						message : "An error was found while processing your confirmation. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.",
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
				res.render('register', {
					ordersnum: req.session.orders,
					sharesnum: req.session.shares,
					title : 'Confirm Registration',
					/*loggedIn : true,*/
					displayForm: true,
					hashid: id,
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
					message : "Sorry we could not find your Pre-Registration. Please Register.",
					scripts : [ '/javascripts/utils.js' ]
				});
			} else {
					res.render('register', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						message : "An error was found while processing your registration. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.",
						scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
	}
});

	router.get('/changepassword/:id', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.render('changepassword', {
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Change Password',
			/*loggedIn : true,*/
			displayForm: true,
			hashid: req.params.id,
			isLoggedInAdmin: req.session.admin,
			labyoker : req.session.user,
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
		var dateStripped = moment(new Date).tz("America/New_York").format(
				'YYYY-MM-DD'); // '2014-06-09'

		if (id != null && id.length > 0){
			var pwdChange = new LabyokerPasswordChange(id, req.body.pass);
			pwdChange.checkIfChangePassword(function(error, results) {
			
			console.log("LabyokerPasswordChange results: " + results);
			
			if (results != null && results.length > 0 && results == 'passwordReset') {
					res.render('changepassword', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						messageSuccess : "Congratulations you have successfully changed your Password. Please head to the <a href='/login'>login</a> page.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('changepassword', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						labyoker : req.session.user,
						isLoggedInAdmin: req.session.admin,
						message : "An error was found while processing your change password. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'dateExpired') {
						res.render('forgot', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						message : "Unfortunately your Change Password request has expired. Please make a new request.", 
						displayForm: true,
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
					res.render('forgot', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
						/*loggedIn : true,*/
						displayForm: true,
						message : "Sorry we could not find your Change Password request. Please make a new request.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else {
					res.render('changepassword', {
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
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
