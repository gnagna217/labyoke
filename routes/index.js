var labyokeFinderClass = require('./labyokerfinder');
var accounting = require('./accounting');
var dates = require('../config/staticvariables');


var LabYokerOrder = labyokeFinderClass.LabYokerOrder;
var LabYokeReporterOrders = labyokeFinderClass.LabYokeReporterOrders;
var LabYokeReporterShares = labyokeFinderClass.LabYokeReporterShares;
var LabYokeReporterSavings = labyokeFinderClass.LabYokeReporterSavings;
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
var jstz = require('jstimezonedetect');

var express = require('express');
var util = require('util');
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
        console.log("inside upload function");
        callback(null, true);
    }
}).single('file');


module.exports = function(router) {

	var competitionStarts = dates.competitionStarts;
	var competitionEnds = dates.competitionEnds;


    router.post('/share/:doing', isLoggedIn, function(req, res) {
    	if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		var doing = req.params.doing;
		console.log("do: " + doing);
    	res.setLocale(req.cookies.i18n);
        var exceltojson;
        upload(req,res,function(err){
        	var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('share', {
                   doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "generic", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('share', {
                   doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "nofile", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
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
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('share', {
                    	doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "nodata", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    	});
                    	cont = 0;
                    	console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                    		/*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                    	//console.log("is upload json: " + json);
                    	console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                    	console.log("inside successful upload");
                    	console.log("mysharesrequest " + req.session.mysharesrequest);
                    	res.render('share', {
                    	doing:"upload",lang:req.cookies.i18n, i18n:res, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    });
                	} else {
                		console.log("inside not successful upload");
                		res.render('share', {doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "databaserror", report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
						req.session.messages = null;
                	}
                });
}

		//});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });

    router.post('/share', isLoggedIn, function(req, res) {
    	if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
    	res.setLocale(req.cookies.i18n);
        var exceltojson;
        upload(req,res,function(err){
        	var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('share', {
                   lang:req.cookies.i18n, i18n:res, nosuccess: "generic", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('share', {
                   lang:req.cookies.i18n, i18n:res, nosuccess: "nofile", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
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
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('share', {
                    	lang:req.cookies.i18n, i18n:res, nosuccess: "nodata", myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    	});
                    	cont = 0;
                    	console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                    		/*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                    	//console.log("is upload json: " + json);
                    	console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                    	console.log("inside successful upload");
                    	console.log("mysharesrequest " + req.session.mysharesrequest);
                    	res.render('share', {
                    	lang:req.cookies.i18n, i18n:res, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    });
                	} else {
                		console.log("inside not successful upload");
                		res.render('share', {lang:req.cookies.i18n, i18n:res, nosuccess: "databaserror", report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
						req.session.messages = null;
                	}
                });
}

		//});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });


	router.get('/', function(req, res) {
		res.redirect('/search');
	});

	router.get('/admin', function(req, res) {
		res.redirect('/share');
	});

    router.get('/admins', function(req, res) {
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        res.setLocale(req.cookies.i18n);
        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin);
        labYokeAgents.findmyshares(function(error, results) {
            //req.session.orders = results[2];
            req.session.myshares = results[0];
            req.session.report_sharesbycategory = results[1];
            req.session.mysharesrequest = results[3];
            req.session.test = results[4];
            req.session.report_venn = results[5];
            req.session.shares = 0;
            console.log("test ? " + results[3]);
            res.render('admins', {lang:req.cookies.i18n, i18n:res, test: results[4], currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
            req.session.messages = null;
        });
    });

	router.get('/test', function(req, res) {

		var lang = req.query.lang;
		console.log("lang is init: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
		var labYokeTest = new LabYokeTest(res);
		labYokeTest.test(function(error, done) {

		res.render('test',{lang:req.cookies.i18n, i18n: res});
	});
	});

	router.get('/help', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(lang == null || lang == undefined){
			lang = req.cookies.i18n;
			console.log("lang is from cookies: " + lang);
		}
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
		res.render('help', {
			lang:req.cookies.i18n,
			i18n:res,
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Help',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
            labyokersurname : req.session.surname,
			isLoggedInAdmin: req.session.admin,
			menu : 'help',
			title: 'Help'
		});
	});

	router.get('/about', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		res.render('about', {
			lang:req.cookies.i18n,
			i18n:res,
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'About Us',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
            labyokersurname : req.session.surname,
			isLoggedInAdmin: req.session.admin,
			menu : 'about'
		});
	});

	router.get('/logout', function(req, res) {
		req.logout();
		req.session.user = null;
        req.session.surname = null;
		req.session.loggedin = false;
		res.redirect('/login');
	});

	function isLoggedIn(req, res, next) {
		if (req.session.user)
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/login');
	}
	function isLoggedInAdmin(req, res, next) {
		console.log("req.session.useradmin: " + req.session.useradmin);
		console.log("req.session.usersuperadmin: " + req.session.usersuperadmin);
		if (req.session.user && (req.session.useradmin || req.session.usersuperadmin))
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
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
		var mom = moment().tz(jstz.determine().name()).format;
		console.log("moment.tz(jstz.determine().name()): " + jstz.determine().name());
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(lang == null || lang == undefined){
			lang = req.cookies.i18n;
			console.log("lang is from cookies: " + lang);
		}
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);

		if (req.session.user) {
			res.redirect('/search');
		} else {
			console.log("in LOGIN: GET LABS");
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				var labYokeGlobal = new LabYokeGlobal(labs);
			labYokeGlobal.getlatestshares(function(error, latest) {
				console.log("in LOGIN: GET LABS now " + req.session.labs);
				console.log("loggin in labs: " + labs);
				console.log("loggin in latest: " + latest);
				res.render('login', {latestshares:latest, mom: mom, lang:req.cookies.i18n, i18n: res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title: 'Login',isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			});
			});

		}
	});

	router.get('/search', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		console.log("getsearch - i18n: " + req.cookies.i18n);
		res.setLocale(req.cookies.i18n);
		console.log("getsearch - userlang: " + req.session.userlang);
		if (req.session.user) {
			var labYokeSearch = new LabYokeSearch("",req.session.email,"");
			labYokeSearch.findagents(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('search', {userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, agentsResults : results, loggedIn : true, title: 'Reagent Search'});
				} else {
					res.render('search', {userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reagent Search'});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});



	router.get('/orders', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		if (req.session.user) {
			var labyokerLab = new LabyokerLab(req.session.lab);
		labyokerLab.getLabsInDept(function(error, categories) {
			console.log("load categories in reports : " + categories);
			req.session.categories = categories;
			var labYokerGetOrder = new LabYokerGetOrder(req.session.email, req.session.lab,req.session.labs);
			labYokerGetOrder.getorders(function(error, results) {
				labYokerGetOrder.getLabOrders_2(function(error, results2) {
				if(results != null){
					//req.session.shares = results[2];
					//req.session.orders = 0;
					console.log("orders results: " + results[0]);
					console.log("lab orders results0: " + results2);
					console.log("booster",req.session.savingsText);

					var booster = [];
					var boostercolor = [];
					booster.push(req.session.savingsTextInitial);
					boostercolor.push(req.session.savingsColorInitial);
					var totalorders = 0;
					var totalshares = 0;
					if(results != null && results.length > 0){
						totalorders = results[0].length;
					}
					if(results != null && results.length > 1){
						
						/*totalshares = results[5].filter(function checkOrder(op) {
	console.log("op agent is: " + op.agent);
	console.log("op email is: " + op.email);
	console.log("myemail: " + req.session.email);
    return op.email == req.session.email;
});*/
var t = results[5];
totalshares = t[0].counting;

						console.log("totalshares in booster: " + totalshares);
						//totalshares = totalshares.length;
						console.log("totalshares in booster length: " + totalshares);
					}

					var labs = req.session.labs;
					var labadmin;
					var nonadmin = (res.__("index.orders.nonadmin1", { labadmin: labadmin })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'); //" Email your <a href='mailto:"+labadmin+"'>administrator</a> if needed.";
					console.log("booster labs "+ labs);
					for(var i in labs){
						//var labrow = util.inspect(labs[i], false, null);
						console.log("booster labi "+ labs[i]);
						console.log("booster curent lab is: "+ req.session.lab);
						console.log("booster labiname "+ labs[i].labname);
			       		//var lab = labs[i].lab
			       		if(labs[i].labname == req.session.lab){
			       		labadmin = labs[i].admin;
			       		}
			       		//console.log("lab is: "+ lab);
			       	}
			       	if(req.session.admin == 1){
			       	nonadmin = (res.__("index.orders.nonadmin2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>'); //" You can do so with the <a href='/share#upload'>upload tool</a> to add more reagents under your name."
			       	}
			       	console.log("nonadmin is: " + nonadmin);
					//booster.push("<strong> Self Kudos!</strong> You have ordered a total of <b>" + totalorders + " order(s)</b> and received a total of <b>" + totalshares + " requested share(s)</b>. Keep it up!");
					booster.push((res.__("index.orders.booster1", { totalorders: totalorders, totalshares: totalshares })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
					boostercolor.push("success");
					if(totalorders > totalshares){
						//booster.push("<strong> Caution.</strong> You are ordering <b>more</b> than you are sharing. Did you replenish your inventory?" + nonadmin);
						booster.push((res.__("index.orders.booster2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + nonadmin);
						boostercolor.push("warning");
					} else if(totalshares > totalorders){
						//booster.push("<strong> Major Achievement!</strong>  You are sharing <b>more</b> than you are ordering. Way to contribute to your lab's savings!");
						booster.push((res.__("index.orders.booster3")).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
						boostercolor.push("success");
					} else if(totalshares == totalorders){
						//booster.push("<strong> Strong and Steady!</strong> You are perfectly <b>balanced</b>! You are sharing as many reagents as you are ordering. Way to go!");
						booster.push((res.__("index.orders.booster4")).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
						boostercolor.push("success");
					}
					var b = Math.floor((Math.random() * booster.length-1) + 1);
					console.log("orders - b radomized: " + b);
					console.log("orders - b length radomized: " + booster.length);
					req.session.savingsText = booster[b];
					req.session.savingsColor = boostercolor[b];
					//console.log("lab orders results1: " + results2[1]);				
					//res.render('orders', {test: results[3], laborders: results2[0],lab1orders: results2[1], ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1]});
					res.render('orders', {lang:req.cookies.i18n, i18n:res,booster:req.session.savingsText, boostercolor:req.session.savingsColor,currentlabname:req.session.lab, categories: req.session.categories, test: results[3], laborders: results2, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1], report_ordersbycategory: results[4]});
				}
			});
				});
				});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/orders', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
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
			var userlang = req.session.userlang;
			var ownerlang = req.body.langform;
            var labadmin = req.session.labadmin;
			var labYokerorder = new LabYokerOrder(lab, agent, vendor, catalognumber,email,location,reqemail,quantity, req.session.lab,res,userlang,ownerlang,labadmin);
			labYokerorder.order(function(error, results) {
				if(results != null && results=="successfulOrder"){
					console.log("ordering agentform: " + agent);
					console.log("ordering location: " + location);
					//console.log("ordering reqcategory: " + reqcategory);
					console.log("booster",req.session.savingsText);
				
					res.render('search', {lang:req.cookies.i18n, i18n:res,booster:req.session.savingsText, boostercolor:req.session.savingsColor, currentlabname:req.session.lab, categories: req.session.categories, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title:'Search',loggedIn : true, order_location: location, order_agent: agent, order_vendor: vendor, order_catalog: catalognumber, email: email});
					req.session.messages = null;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/cancelshare', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		if (req.session.user) {
			var agent = req.body.agent;
			var lab = req.body.lab;
			var vendor = req.body.vendor;
			var catalognumber = req.body.catalognumber;
			var table = req.body.table;
			var email = req.body.email;
			var requestor = req.body.requestoremail;
			var checked = req.body.cancel;
			var userlang = req.cookies.i18n;
			var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
				'MM-DD-YYYY');
			var datenow = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
			if(checked != null)
				checked = 0;
			if(checked == undefined)
				checked = 1;
			console.log("date: " + date);
			console.log("laab: " + lab);
			console.log("agent: " + agent);
			console.log("vendor: " + vendor);
			console.log("catalognumber: " + catalognumber);
			console.log("checked: " + checked);
			console.log("table: " + table);
			console.log("email: " + email);
            console.log("userlang: " + userlang);
			console.log("requestoremail: " + requestor);
			var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date, lab, res,userlang);
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


	router.get('/reports', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);

		var datefrom = "01-01-2016";
		var dateto = "01-01-2017";
		//var category = req.body.reportCategory;
		console.log("reportSomething intro");
		var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.labs,res);
		labYokereporter.reportSharesIntro(function(error, results) {
		

		var labyokerLab = new LabyokerLab(req.session.lab);
		labyokerLab.getLabsInDept(function(error, categories) {
			console.log("load labs in dept in reports : " + categories);
			req.session.categories = categories;
			if(req.session.labs == undefined){
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
					req.session.labs = labs;
					console.log("load labs in reports : " + labs);
					res.render('reports', {lang:req.cookies.i18n, i18n:res, resultsMoneyIntro:results,dept: req.session.dept, categories: categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
					req.session.messages = null;
				});
			} else {
				res.render('reports', {lang:req.cookies.i18n, i18n:res, resultsMoneyIntro:results, dept: req.session.dept, categories: categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});

});
	});

	router.post('/reportShares', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var datefrom = req.body.reportDateFrom;
		var dateto = req.body.reportDateTo;
		var category = req.body.reportCategory;
		console.log("reportSomething " + req.body.reportDateFrom);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        if(!iserror){
    		var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.labs,res);
    		labYokereporter.reportShares(function(error, results) {
    			if(results != null){
    				console.log("res " + results);
    				if(results != ""){
    					res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, resultsShares: results, isLoggedInAdmin: req.session.admin, addMessageShares: "success"});
    				} else {
    					res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageShares: "failure"});
    				}
    				req.session.messages = null;
    			}
    		});
        } else {
            res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageShares: "wrongdate"});
        }
	});

	router.post('/reportMoney', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var datefrom = req.body.reportDateFromMoney;
		var dateto = req.body.reportDateToMoney;
		var agent = req.body.reportAgentMoney;
		var vendor = req.body.reportVendorMoney;
		var catalognumber = req.body.reportCatalogMoney;
		var lab = req.body.reportLabMoney;
		 

		console.log("reportMoney datefrom: " + datefrom);
		console.log("reportMoney dateto: " + dateto);
		console.log("reportMoney agent: " + agent);
		console.log("reportMoney vendor: " + vendor);
		console.log("reportMoney catalognumber: " + catalognumber);
		console.log("reportMoney lab: " + lab);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        if(!iserror){
		var labYokereporterSavings = new LabYokeReporterSavings(datefrom,dateto,agent,vendor,catalognumber,lab, req.session.lab,req.session.labs,res);
		labYokereporterSavings.reportMoney(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results!=undefined && results != ""){
					console.log("successful money report");
					res.render('reports', {lang:req.cookies.i18n, i18n:res,dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, resultsMoney: results, isLoggedInAdmin: req.session.admin, addMessageMoney: "success", section: "money"});
				} else {
					console.log("failed money report");
					res.render('reports', {lang:req.cookies.i18n, i18n:res,dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageMoney: "failure", section: "money"});
				}
				req.session.messages = null;
			}
		});
        } else {
            res.render('reports', {lang:req.cookies.i18n, i18n:res,dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageMoney: "wrongdate", section: "money"});
        }
	});

	router.post('/reportInsuff', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var datefrom = undefined;
		var dateto = undefined;
		var agent = req.body.reportAgentInsuff;
		var vendor = req.body.reportVendorInsuff;
		var catalognumber = req.body.reportCatalogInsuff;
		var lab = req.body.reportLabInsuff;
		 

		console.log("reportInsuff datefrom: " + datefrom);
		console.log("reportInsuff dateto: " + dateto);
		console.log("reportInsuff agent: " + agent);
		console.log("reportInsuff vendor: " + vendor);
		console.log("reportInsuff catalognumber: " + catalognumber);
		console.log("reportInsuff lab: " + lab);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        if(!iserror){
		var labYokereporterSavings = new LabYokeReporterSavings(datefrom,dateto,agent,vendor,catalognumber,lab, req.session.lab,req.session.labs,res);
		labYokereporterSavings.reportInsuff(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results!=null && results != ""){
					res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Reports',loggedIn : true, resultsInsuff: results, isLoggedInAdmin: req.session.admin, addMessageInsuff: "success"});
				} else {
					res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageInsuff: "failure"});
				}
				req.session.messages = null;
			}
		});
        } else {
            res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageInsuff: "wrongdate"});
        }
	});

	router.post('/changeDetails', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var col = req.body.column;
		var val = req.body.valuedetail.replace("'","");
		var email = req.body.formemail;
		console.log("changeDetails col: " + col);
		console.log("changeDetails val: " + val);
		console.log("changeDetails email: " + email);
		var labYokedetails = new LabyokerUserDetails(col, val, email,req.session.user, req.session.surname,res);
		labYokedetails.changeDetails(function(error, results) {
			if(results){
				if(col == 'name'){
					req.session.user = val;
				}
				if(col == 'surname'){
					req.session.surname = val;
				}
				console.log("res changeDetails " + results);


		var labyokerTeam = new LabyokerTeam(req.session.lab);
		labyokerTeam.getTeam(function(error, team) {
		if(req.session.labs == undefined){
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("load labs in account : " + labs);
				var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin);
				labYokeAgents.getLabyoker(function(error, userresults) {
				res.render('account', {lang:req.cookies.i18n, i18n:res, userDetails: userresults, labname: req.session.lab, team:team, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
					req.session.messages = null;
				});
			});
		} else {
			var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin);
			labYokeAgents.getLabyoker(function(error, userresults) {
				res.render('account', {lang:req.cookies.i18n, i18n:res, userDetails: userresults, labname: req.session.lab, team:team, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			});
		}
		});



				//res.render('account', {lang:req.cookies.i18n, i18n:res, userDetails: userresults, labname: req.session.lab, team:team, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});
	});

	router.post('/reportOrders', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var datefrom = req.body.reportDateFromOrders;
		var dateto = req.body.reportDateToOrders;
		var lab = req.body.reportLabOrders;
		var category = req.body.reportCategoryOrders;
		console.log("reportOrders reportDateFromOrders: " + req.body.reportDateFromOrders);
		console.log("reportOrders lab: " + lab);
		console.log("reportOrders category: " + category);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        if(!iserror){
		var labYokereporter = new LabYokeReporterOrders(datefrom, dateto, lab, req.session.labs, req.session.lab, res);
		labYokereporter.reportOrders(function(error, results) {
			if(results != null){
				console.log("res " + results);
				if(results != ""){
					res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, resultsOrders: results, isLoggedInAdmin: req.session.admin, addMessageOrders: "success"});
				} else {
					res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageOrders: "failure"});
				}
				req.session.messages = null;
			}
		});
        } else {
            res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageOrders: "wrongdate"});            
        }
	});

	router.get('/play', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		res.render('play', {lang:req.cookies.i18n, i18n:res,ordersnum: req.session.orders, sharesnum: req.session.shares, title: 'Play',labyoker : req.session.user, labyokersurname : req.session.surname});
		req.session.messages = null;
	});

	router.get('/pop', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
			console.log("in pop: GET LABS");
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				var labYokeGlobal = new LabYokeGlobal(labs);
				labYokeGlobal.getlatestshares(function(error, latest) {
					console.log("in pop: GET LABS now " + req.session.labs);
					console.log("pop in labs: " + labs);
					console.log("pop in latest: " + latest);
					res.render('pop', {latestshares:latest,lang:req.cookies.i18n, i18n:res, title: 'Pop'});
				});
			});
		req.session.messages = null;
	});

	router.get('/share/:doing', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		var doing = req.params.doing;
		console.log("do: " + doing);
		res.setLocale(req.cookies.i18n);
		var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.myshares = results[0];
			req.session.report_sharesbycategory = results[1];
			req.session.mysharesrequest = results[3];
			req.session.test = results[4];
			req.session.report_venn = results[5];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
			res.render('share', {doing:"upload",lang:req.cookies.i18n, i18n:res,report_venn: results[5], test: results[4], currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/share', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.myshares = results[0];
			req.session.report_sharesbycategory = results[1];
			req.session.mysharesrequest = results[3];
			req.session.test = results[4];
			req.session.report_venn = results[5];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
			res.render('share', {lang:req.cookies.i18n, i18n:res,report_venn: results[5], test: results[4], currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/account', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		console.log("inside accounnt: " + req.session.email);
		console.log("account labs: " + req.session.labs);
		console.log("account lab: " + req.session.lab);
		var labyokerTeam = new LabyokerTeam(req.session.lab);
		labyokerTeam.getTeam(function(error, team) {
		if(req.session.labs == undefined){
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("load labs in account : " + labs);
				var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin);
				labYokeAgents.getLabyoker(function(error, results) {
					res.render('account', {lang:req.cookies.i18n, i18n:res, dept: req.session.dept, labname: req.session.lab, team:team, labs: req.session.labs, userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
					req.session.messages = null;
				});
			});
		} else {
			var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin);
			labYokeAgents.getLabyoker(function(error, results) {
				res.render('account', {lang:req.cookies.i18n, i18n:res, dept: req.session.dept, labname: req.session.lab, team:team, labs: req.session.labs, userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
				req.session.messages = null;
			});
		}
		});
	});
	

	router.get('/forgot', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(req.cookies.i18n != undefined && req.cookies.i18n!=null){
				lang = req.cookies.i18n;
		} else if(lang == null || lang == undefined){
			lang = "en";
		}
		req.cookies.i18n = lang;
		res.setLocale(lang);
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
		res.render('forgot', {lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password'});
		req.session.messages = null;
	});

	router.post('/forgot', function(req, res) {
			var lang = req.query.lang;
			console.log("lang is forgot user: " + lang);
			if(req.cookies.i18n != undefined && req.cookies.i18n!=null){
				lang = req.cookies.i18n;
			} else if(lang == null || lang == undefined){
				lang = "en";
			}
			res.setLocale(lang);
			var forgotuser = req.body.forgotuser;
			if (forgotuser != null && forgotuser.length > 0){
				var dateStripped = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
				console.log("dateStripped2: " + dateStripped);
				var labyoker = new Labyoker(forgotuser,dateStripped,res,req.session.userlang);
				labyoker.requestChangePassword(function(error, done) {
					console.log("done: " + (done != null && done.length > 0 && done == 'alreadySent'));
					console.log("done2: " + (done != null && done == 'alreadySent'));
					if (done != null && done.length > 0 && done != 'alreadySent') {
						res.render('forgot', {lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, userfound : forgotuser, title: 'Forgot Password'});
					} else if(done != null && done.length > 0 && done == 'alreadySent') {
						res.render(
							'forgot',
							{
								lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : res.__("index.forgot.message1"), usernotfound : true, noforgotform: true
							});
					} else {
						res.render(
							'forgot',
							{
								lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,  labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : res.__("index.forgot.message2"), usernotfound : true
							});
					}
				});
			} else {
				res.render(
					'forgot',
					{
						lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,  labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : res.__("index.forgot.message3"), usernotfound : true
					});

			}
			//req.session.messages = null;
	});

	router.get('/register', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(lang == null || lang == undefined){
			lang = req.cookies.i18n;
			console.log("lang is from cookies: " + lang);
		}
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
			console.log("register labs: " + req.session.labs);
			if(req.session.labs == undefined){
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
					req.session.labs = labs;
					console.log("load labs in register : " + labs);
					res.render('register', {lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register'});
					req.session.messages = null;
					req.body.reglab = null;
				});
			} else {
				res.render('register', {lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register'});
				req.session.messages = null;
				req.body.reglab = null;
			}

	});

	router.get('/reportShares', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportMoney', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportInsuff', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportOrders', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/changeDetails', function(req, res) {
		res.redirect('/account');
	});

	router.get('/cancelshare', function(req, res) {
		res.redirect('/share');
	});

	router.get('/searchCatalog', function(req, res) {
		res.redirect('/search');
	});

	router.post('/register', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		var rendered = false;
		var lab = req.body.reglab;
		var user = req.body.reguser;
		var user_pwd = req.body.regpass;
		var user_verpwd = req.body.regverpass;
		var user_name = req.body.regfirstname;
		var user_surname = req.body.reglastname;
		var user_email = req.body.regemail;
		var user_tel = req.body.regtel;
		var userlang = req.cookies.i18n;

		if(req.session.labs == undefined){
			res.redirect('/register');
		}
		/*const util = require('util');
		var labs = req.session.labs;
		for(var i in labs){
			var labrow = util.inspect(labs[i], false, null);
       		//var lab = labs[i].lab
       		console.log("i is: "+ i);
       		console.log("lab util: " + labrow);
       		console.log("labrow lab util: " + labrow.labname);
       		//console.log("lab is: "+ lab);
       	}*/


		if (user && user_name && user_pwd && lab && user_surname && user_email && user_tel) {
			console.log("second section processing...");
			console.log("user: " + user);
			console.log("user_pwd: " + user_pwd);
			console.log("user_verpwd: " + user_verpwd);
			console.log("lab: " + lab);
			console.log("user_name: " + user_name);
			console.log("user_surname: " + user_surname);
			console.log("user_email: " + user_email);
			console.log("user_tel: " + user_tel);
			console.log("user_tel: " + userlang);
			var labyokerRegister = new LabyokerRegister(user,user_pwd,lab,user_name,user_surname,user_email,user_tel,res,userlang);
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
				if(done != null && done.length > 0 && done == 'idalreadyInUse') {
						console.log("status = idalreadyInUse");
						rendered = true;
						res.render('register', {lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message11")});
				} else if(done != null && done.length > 0 && done == 'firstsection') {
					console.log("status = firstsection1");
					rendered = true;
					res.render(
						'register',
						{
							lang:req.cookies.i18n,
							i18n: res,
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
                            labyokersurname : req.session.surname,
							labs: req.session.labs
						});
				} else if (done != null && done.length > 0 && done != 'success') {
					console.log("status = status1");
					res.render('register', {lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message3")});
				} else if(done != null && done.length > 0 && done == 'success') {
					console.log("status = success1");
					rendered = true;
					console.log("successfully registered " + user_name);
					res.render(
						'register',
						{
							lang:req.cookies.i18n,
							i18n:res,
							ordersnum: req.session.orders,
							sharesnum: req.session.shares, 
							regsuccess : user_name,
							labentered : false,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
                            labyokersurname : req.session.surname,
							labs: req.session.labs
						});
				} else {
					res.render(
						'register',
						{
							lang:req.cookies.i18n,
							i18n:res,
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							message : res.__("index.register.message2"),
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
                            labyokersurname : req.session.surname,
							labs: req.session.labs
						});
				}
			});
			rendered = true;
		} else if (user_name && user_surname && user_email && user_tel) {
				console.log("first section processing...");
				var labyokerRegister = new LabyokerRegister(null,null,null,user_name,user_surname,user_email,user_tel,res,userlang);
				req.session.firstname = user_name;
				req.session.lastname = user_surname;
				req.session.email = user_email;
				req.session.tel = user_tel;
				labyokerRegister.register(function(error, done) {

					if(done != null && done.length > 0 && done == 'alreadyInUse') {
						console.log("status = alreadyInUse");
						rendered = true;
						res.render('register', {lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message1")});
					} else if(done != null && done.length > 0 && done == 'firstsection') {
						console.log("status = firstsection");
						rendered = true;
						res.render(
							'register',
							{
								lang:req.cookies.i18n,
								i18n:res,
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
                                labyokersurname : req.session.surname,
								labs: req.session.labs
							});
					} else if(done != null && done.length > 0 && done != 'success') {
						console.log("status = not successful");
						rendered = true;
						res.render('register', {i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message3")});
					} else if(done != null && done.length > 0 && done == 'success') {
						console.log("status = success");
						rendered = true;
						res.render(
							'register',
							{
								lang:req.cookies.i18n,
								i18n:res,
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								regsuccess : user_name,
								labentered: false,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
                                labyokersurname : req.session.surname,
								labs: req.session.labs
							});
					} else {
						console.log("status = something else happened");
						rendered = true;
						res.render(
							'register',
							{
								lang:req.cookies.i18n,
								i18n: res,
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								message : res.__("index.register.message2"),
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
                                labyokersurname : req.session.surname,
								labs: req.session.labs,
							});
					}
					if(!rendered){
						console.log("nothing entered");
						res.render('register', {lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, message : res.__("index.register.message4"), title: 'Register'});
					}
				});
			} else {
				res.render(
				'register',
				{
					lang:req.cookies.i18n,
					i18n:res,
					ordersnum: req.session.orders,
					sharesnum: req.session.shares, 
					message : res.__("index.register.message2"),
					title: 'Register',
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
                    labyokersurname : req.session.surname,
					labs: req.session.labs
				});
			}
	});

	router.post('/search', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		if (req.session.user) {
			res.setLocale(req.cookies.i18n);
			var searchText = req.body.searchText;
			var searchType = req.body.searchType;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email, searchType);
			var messageStr = "";
			console.log("search - userlang: " + req.session.userlang);
            console.log("search - searchType: " + searchType);
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);	
				if (searchText != null && searchText.length > 0){
					if(results[0].length == 0){
						messageStr = (res.__("index.search.message1", {searchText:searchText})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						//messageStr = "Sorry we could not find any results with your reagent search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('search', {searchType:searchType,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab, message: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformText: searchText, loggedIn : true});
				} else {
					messageStr = "You entered an invalid reagent keyword. Please try again.";
					res.render('search', {searchType:searchType,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, message: res.__("index.search.message2"), mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Search', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/searchCatalog', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
		if (req.session.user) {
			var searchText = req.body.searchTextCatalog;
			var searchType = req.body.searchType;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email, searchType);
			var messageStr = "";
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);
                console.log("searchType " + searchType);	
				if (searchText != null && searchText.length > 0){
                    console.log("searchType catalog 2 "  + searchType);
					if(results[0].length == 0){
						messageStr = (res.__("index.searchcatalog.message1", {searchText:searchText})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						//messageStr = "Sorry we could not find any results with your catalog search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('search', {searchType: "catalog",userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab, messageCatalog: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Reagent Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformTextCatalog: searchText, loggedIn : true});
				} else {
                    console.log("searchType catalog 1 " + searchType);
					messageStr = "You entered an invalid catalog keyword. Please try again.";
					res.render('search', {searchType: "catalog",userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, messageCatalog: res.__("index.searchcatalog.message2"),mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Reagent Search', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		} else {
			res.redirect('/login');
		}
	});

	router.post('/login',function(req, res) {

		var mom = moment().tz(jstz.determine().name()).format;
		console.log("timezone jstz.determine().name(): " + jstz.determine().name());
		console.log("req.cookies.i18n: " + req.cookies.i18n);
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		console.log("req.cookies.i18n after setup: " + req.cookies.i18n);
		res.setLocale(req.cookies.i18n);
		if (req.session.user) {
			res.redirect('/search');
		} else {
						var username = req.body.user;
						var password = req.body.pass;
						if (username != null && username.length > 0
								&& password != null && password.length > 0) {
							var labyoker = new Labyoker(username, password);

							labyoker
									.login(function(error, results) {
										var done, shares, orders, dept, labadmin;

										if(results != null && results.length > 0){
											done = results[0];
											dept = results[1];
                                            labadmin = results[2];
                                            console.log("dept: " + dept);
                                            console.log("labadmin: " + labadmin);
                                            req.session.labadmin = labadmin;
                                            req.session.dept = dept;
											res.setLocale(done[0].lang);
										}
										
										/*if(results != null && results.length > 2){
											orders = results[2];
											req.session.orders = orders;
										}*/
										console.log("done is " + done);
										console.log("department is : " + dept);
										//console.log("done2 is " + done.length);
										console.log("shares is " + shares);
										console.log("orders is " + orders);

										if (done != null && done.length > 0) {
											if (done[0].active == 0) {

												return res
														.render(
															'login',
															{
																i18n:res,lang:req.cookies.i18n,message : (res.__("index.login.message1")).replace(/&lt;/g, '<').replace(/&gt;/g, '>') /*"You have not completed your registration. Please check your emails and click on the link."*/, title: 'Login'
															});
											}
											if (done[0].disable == 0) {

												return res
														.render(
															'login',
															{
																i18n:res,lang:req.cookies.i18n,message : (res.__("index.login.message2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>')/*"Your account has been disabled. Please contact your lab administrator."*/, title: 'Login'
															});
											}

											var init = new LabyokerInit(done[0].email, done[0].lab);
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
                                                    req.session.surname = done[0].surname;
													//req.session.dept = dept[0].department;
													req.session.userid = done[0].id;
													req.session.userlang = done[0].lang;
													req.session.useradmin = false;
                                                    console.log("user surname (NEW): " + req.session.surname);
													console.log("user language: " + req.session.userlang);
													console.log("admin: " + done[0].admin);
													var c = parseInt(done[0].admin,10);
													req.session.admin = c;
													console.log("c: " + c);
													if(c > 0 ){
														req.session.admin = 1;
														req.session.useradmin = true;
													}
													if(c > 1){
														req.session.usersuperadmin = true;
													}
													console.log("req.session.useradmin? " + req.session.useradmin);
													console.log("req.session.usersuperadmin? " + req.session.usersuperadmin);
													req.session.active = done[0].active;
													req.session.email = done[0].email;
													req.session.lab = done[0].lab;
													req.session.fullname = done[0].name;
													req.session.surname = done[0].surname;
													console.log("fullname " + req.session.fullname);
													console.log("email " + req.session.email);
													req.session.loggedin = true;

													console.log("initial req.session.lab: " + req.session.lab);
													var timeframesavings = "year";
													var choosetime = "";
													var timearr = ["year","month","all"];
													var labarr = ["all",req.session.lab];
													var datefromsavings = "";
													var datetosavings = "";
													var lab = "";
													var labsavings = "";
//(res.__("index.login.message2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
													var t = Math.floor((Math.random() * timearr.length-1) + 1);
													var l = Math.floor((Math.random() * labarr.length-1) + 1);
													console.log("random int time: " + t);
													console.log("random int lab: " + l);

													lab = labarr[l];
													choosetime = timearr[t];
													console.log("lab: " + lab);
													console.log("choosetime: " + choosetime);

													if(lab == "all"){
														//labsavings = "<b><i>WORLD</i></b>";
														labsavings = (res.__("index.login.all1")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
													} else {
														//labsavings = "<b><i>Other Labs</i></b>";
														labsavings = (res.__("index.login.all2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
													}
													var choose = "";
													if(choosetime == "year"){
														var date = new Date(), y = date.getFullYear(), m = date.getMonth();
														datefromsavings = moment(new Date(y, 0, 1)).tz("America/New_York").format('MM-DD-YYYY');
														datetosavings = moment(new Date(y, 12, 1)).tz("America/New_York").format('MM-DD-YYYY');
														choose = (res.__("index.login.time1.year",{choosetime: "année"})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
														/*datefromsavings = "01-01-2016";
														datetosavings = "12-31-2016";*/
													}
													if(choosetime == "month"){
														var date = new Date(), y = date.getFullYear(), m = date.getMonth();
														datefromsavings = moment(new Date(y, m, 1)).tz("America/New_York").format('MM-DD-YYYY');
														datetosavings = moment(new Date(y, m + 1, 0)).tz("America/New_York").format('MM-DD-YYYY');
														choose = (res.__("index.login.time1.month",{choosetime: "mois"})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
														/*datefromsavings = "12-01-2016";
														datetosavings = "12-31-2016";*/
													}
													timeframesavings = choose; //"this past <b>" + choosetime + "</b>";
													if(choosetime == "all"){
														datefromsavings = undefined;
														datetosavings = undefined;
														//timeframesavings = "over time";
														timeframesavings = res.__("index.login.time2");
													}
													
													console.log("timeframesavings datefromsavings: " + datefromsavings);
													console.log("timeframesavings datetosavings: " + datetosavings);
													console.log("timeframesavings: " + timeframesavings);
													var booster = [];
													var boostercolor = [];
													if(orders > 0){
														//booster.push("<strong> Notification!</strong> You have <b>" + orders + " new order(s)</b> pending completion.");
														booster.push((res.__("index.login.booster1",{orders: orders})).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
														boostercolor.push("warning");
													}
													if(shares > 0){
														//booster.push("<strong> Notification!</strong> You have <b>" + shares + " new share(s)</b> pending completion. <a href='/share'>Check it out</a> promptly and fulfill the request. Way to contribute to your lab's savings!");
														booster.push((res.__("index.login.booster2", {orders: orders})).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
														boostercolor.push("warning");
													}

									console.log("in LOGIN: GET LABS - " + req.session.labs);
			if(req.session.labs != null && req.session.labs != undefined){
													var labYokereporterSavings = new LabYokeReporterSavings(datefromsavings,datetosavings,undefined,undefined,undefined,lab, req.session.lab,req.session.labs,res);
													labYokereporterSavings.dataMoney(function(error, savings) {
														console.log("savings: " + savings);

														req.session.savings = savings;
														var cheer = res.__("index.login.cheer1");//"Keep searching, ordering, and sharing!";
														if (savings > 10000){
															cheer = res.__("index.login.cheer2"); //"Amazing! You are a rock star!";
														} else if (savings > 1000){
															cheer = res.__("index.login.cheer3"); //"Incredible!";
														} else if(savings > 100){
															cheer = res.__("index.login.cheer4"); //"Keep it up!";
														} 
														if(savings > 0){
														var text = "";
														console.log("non-null savings: " + accounting.formatMoney(savings));
														if(lab == "all"){
															//text = "<strong> Major Achievement!</strong> You are part of a " + labsavings + " savings for a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + " in your department. " + cheer;
															text = (res.__("index.login.text1", {labsavings: labsavings, accountingsavings: accounting.formatMoney(savings), timeframesavings: timeframesavings, cheer: cheer})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
														} else {
															//text = "<strong> Major Achievement!</strong> You have saved " + labsavings + " a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + ". " + cheer;
															text = (res.__("index.login.text2", {labsavings: labsavings, accountingsavings: accounting.formatMoney(savings), timeframesavings: timeframesavings, cheer: cheer})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
														}
														booster.push(text);
														boostercolor.push("success");
														}

														var b = Math.floor((Math.random() * booster.length-1) + 1);
														if(booster[b] == undefined){
															//booster[b] = "Using LabyYoke reduces purchasing prices for <strong>You</strong> and your <strong>Lab</strong>. Use it as a social platform. Have fun and Keep it Up!";
															booster[b] = (res.__("index.login.booster3")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
															console.log(booster[b]);
															boostercolor[b] = "success"
														}
														req.session.savingsTextInitial = booster[b];
														req.session.savingsColorInitial = boostercolor[b];
														console.log("req.session.savingsText: " + req.session.savingsTextInitial);
													

													if(req.session.to != null && req.session.to.length > 0){
														res.redirect(req.session.to);
														req.session.to = null;
													} else {
														res.redirect('/search');
													}
													});
			} else {
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
					req.session.labs = labs;
					console.log("in LOGIN: GET LABS now " + req.session.labs);
					console.log("loggin in labs: " + labs);

														var labYokereporterSavings = new LabYokeReporterSavings(datefromsavings,datetosavings,undefined,undefined,undefined,lab, req.session.lab,req.session.labs,res);
													labYokereporterSavings.dataMoney(function(error, savings) {
														console.log("savings: " + savings);

														req.session.savings = savings;
														var cheer = res.__("index.login.cheer1");//"Keep searching, ordering, and sharing!";
														if (savings > 10000){
															cheer = res.__("index.login.cheer2"); //"Amazing! You are a rock star!";
														} else if (savings > 1000){
															cheer = res.__("index.login.cheer3"); //"Incredible!";
														} else if(savings > 100){
															cheer = res.__("index.login.cheer4"); //"Keep it up!";
														} 
														if(savings > 0){
														var text = "";
														console.log("non-null savings: " + accounting.formatMoney(savings));
														if(lab == "all"){
															//text = "<strong> Major Achievement!</strong> You are part of a " + labsavings + " savings for a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + " in your department. " + cheer;
															text = (res.__("index.login.text1", {labsavings: labsavings, accountingsavings: accounting.formatMoney(savings), timeframesavings: timeframesavings, cheer: cheer})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
														} else {
															//text = "<strong> Major Achievement!</strong> You have saved " + labsavings + " a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + ". " + cheer;
															text = (res.__("index.login.text2", {labsavings: labsavings, accountingsavings: accounting.formatMoney(savings), timeframesavings: timeframesavings, cheer: cheer})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
														}
														booster.push(text);
														boostercolor.push("success");
														}

														var b = Math.floor((Math.random() * booster.length-1) + 1);
														if(booster[b] == undefined){
															//booster[b] = "Using LabyYoke reduces purchasing prices for <strong>You</strong> and your <strong>Lab</strong>. Use it as a social platform. Have fun and Keep it Up!";
															booster[b] = (res.__("index.login.booster3")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
															boostercolor[b] = "success"
														}
														req.session.savingsTextInitial = booster[b];
														req.session.savingsColorInitial = boostercolor[b];
														console.log("req.session.savingsText: " + req.session.savingsTextInitial);
													

													if(req.session.to != null && req.session.to.length > 0){
														res.redirect(req.session.to);
														req.session.to = null;
													} else {
														res.redirect('/search');
													}
													});
				});
			}


												});
											});
										} else {
											res
													.render(
															'login',
															{
																i18n:res,lang:req.cookies.i18n,message : res.__("index.login.message3") /*"Your username and/or password is wrong. Please try again."*/, title: 'Login'
															});
										}
									});
						} else {
							res
									.render(
											'login',
											{
												i18n:res,lang:req.cookies.i18n,message : res.__("index.login.message3") /*"Your username and/or password is wrong. Please try again."*/, title: 'Login'
											});
						}
					}

					});

	router.get('/confirmreg', function(req, res) {
		res.redirect('/register');
	}); 

	router.get('/confirmreg/:id', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is confirm user: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
		req.cookies.i18n = lang;
		res.setLocale(lang);
		var id = req.params.id;
		console.log("confirm register id is: " + id);

		if (id != null && id.length > 0){
			var confirmReg = new LabyokerConfirm(id);
			confirmReg.confirm(function(error, results) {
			
			console.log("LabyokerConfirm results: " + results);
			
			if (results != null && results.length > 0 && results == 'confirmReset') {
					res.render('register', {
						lang:req.cookies.i18n,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						confirmReset : res.__("index.confirmpwd.message1").replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('register', {
						lang:req.cookies.i18n,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						confirmReset : (res.__("index.confirmpwd.message2", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
				res.render('register', {
					lang:req.cookies.i18n,
					i18n:res,
					ordersnum: req.session.orders,
					sharesnum: req.session.shares,
					title : 'Confirm Registration',
					/*loggedIn : true,*/
					displayForm: true,
					hashid: id,
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
                    labyokersurname : req.session.surname,
					confirmReset : res.__("index.confirmpwd.message3").replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
					scripts : [ '/javascripts/utils.js' ]
				});
			} else {
					res.render('register', {
						lang:req.cookies.i18n,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						confirmReset : (res.__("index.confirmpwd.message2", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
						scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
	}
});

	router.get('/changepassword/:id', /*isLoggedInAndNotActive,*/ function(req, res) {
		var lang = req.query.lang;
		console.log("lang is forgot user: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is forgot user: " + lang);
		req.cookies.i18n = lang;
		res.setLocale(lang);
		res.render('changepassword', {
			lang:req.cookies.i18n,
			i18n:res,
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Change Password',
			/*loggedIn : true,*/
			displayForm: true,
			hashid: req.params.id,
			isLoggedInAdmin: req.session.admin,
			labyoker : req.session.user,
            labyokersurname : req.session.surname,
			scripts : [ '/javascripts/utils.js' ]
		});
	});

	router.get('/changepassword', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.redirect('/forgot');
	});

	router.post('/changepassword', /*isLoggedIn,*/ function(req, res) {
		var lang = req.query.lang;
		console.log("lang is forgot user: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
		req.cookies.i18n = lang;
		/*labyoker.changepassword(function(error, done) {
			if (done != null) {
				res.redirect('/');
			}
		});*/
		var id = req.body.hashid;
		console.log("changing password id is: " + id);
		console.log("changing password pwd is: " + req.body.pass);
		var dateStripped = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY'); // '2014-06-09'

		if (id != null && id.length > 0){
			var pwdChange = new LabyokerPasswordChange(id, req.body.pass);
			pwdChange.checkIfChangePassword(function(error, results) {
			
			console.log("LabyokerPasswordChange results: " + results);
			
			if (results != null && results.length > 0 && results == 'passwordReset') {
					res.render('changepassword', {
						lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						messageSuccess : res.__("index.changepwd.message1").replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('changepassword', {
						lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						isLoggedInAdmin: req.session.admin,
						message : (res.__("index.changepwd.message2", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'dateExpired') {
						res.render('forgot', {
						lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						message : res.__("index.changepwd.message3").replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 
						displayForm: true,
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
					res.render('forgot', {
						lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						displayForm: true,
						message : res.__("index.changepwd.message4").replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else {
					res.render('changepassword', {
						lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						displayForm: true,
						message : (res.__("index.changepwd.message5", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 
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
