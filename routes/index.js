var labyokeFinderClass = require('./labyokerfinder');
var dates = require('../config/staticvariables');

var LabyokerPasswordChange = labyokeFinderClass.LabyokerPasswordChange;
var LabyokerRegister = labyokeFinderClass.LabyokerRegister;
var LabYokeFinder = labyokeFinderClass.LabYokeFinder;
var MatchPredictorSingleTeam = labyokeFinderClass.MatchPredictorSingleTeam;
var LabyokerMakesBet = labyokeFinderClass.LabyokerMakesBet;
var LabyokerMakesBets = labyokeFinderClass.LabyokerMakesBets;
var MatchPhase = labyokeFinderClass.MatchPhase;
var Labyoker = labyokeFinderClass.Labyoker;
var MatchResults = labyokeFinderClass.MatchResults;
var MatchAdvancing = labyokeFinderClass.MatchAdvancing;
var moment = require('moment-timezone');

var express = require('express');
var router = express.Router();


	var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

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
                    res.render('share', {
                    json: result, loggedIn : true, title: 'share', spreadname: req.file.originalname
                    });
                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        })
    });


	router.get('/', isLoggedIn, function(req, res) {

		var labyokerMakesBets = new LabyokerMakesBets(req.session.userid);
		var betsMade;
		var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD'); // '2014-06-09'

		if (moment(competitionEnds).diff(moment(dateStripped)) < 0) {
			labyokerMakesBets.getranking(function(error, ranking) {
				res.render('index', {
					title : 'The World Cup has ended!',
					matches : null,
					loggedIn : true,
					labyoker : req.session.user,
					user : req.session.userid,
					menu : 'today',
					state : 'ended',
					moment : moment,
					ranking : ranking,
					userid : req.session.userid,
					now : moment(new Date).tz("Europe/Berlin").format(
							'YYYY-MM-DD HH:mm:ss')
				// '2014-06-09 HH:mm:ss'
				});
			});
		} else {

			if (moment(competitionStarts).diff(moment(dateStripped)) <= 0) {
				labyokerMakesBets.checkIfBetsMade(function(error,
						singleBetsMade) {

					var labyokeFinder = new LabYokeFinder(dateStripped);
					labyokeFinder.getMatchOfTheDay(function(error, match) {
						if (match != null && match.length > 0) {
							req.session.matches = match;
							res.render('index', {
								title : 'Today\'s Match',
								matches : match,
								scripts : [ '/javascripts/utils.js',
										'/javascripts/image_preload.js' ],
								loggedIn : true,
								betsMade : singleBetsMade,
								labyoker : req.session.user,
								user : req.session.userid,
								menu : 'today',
								moment : moment,
								now : moment(new Date).tz("Europe/Berlin")
										.format('YYYY-MM-DD HH:mm:ss')
							// '2014-06-09 HH:mm:ss'
							});
						} else {
							labyokerMakesBets.getranking(function(error,
									ranking) {
								res.render('index', {
									title : 'Rest Day',
									matches : null,
									loggedIn : true,
									labyoker : req.session.user,
									user : req.session.userid,
									menu : 'today',
									state : 'rest',
									moment : moment,
									ranking : ranking,
									now : moment(new Date).tz("Europe/Berlin")
											.format('YYYY-MM-DD HH:mm:ss')
								// '2014-06-09 HH:mm:ss'
								});
							});
						}
					});
				});
			} else {
				res.render('index', {
					title : 'Countdown to the World Cup!!!',
					matches : null,
					loggedIn : true,
					labyoker : req.session.user,
					user : req.session.userid,
					menu : 'today',
					state : 'notstarted',
					startdate : competitionStarts,
					moment : moment,
					userid : req.session.userid,
					now : moment(new Date).tz("Europe/Berlin").format(
							'YYYY-MM-DD HH:mm:ss')
				// '2014-06-09 HH:mm:ss'
				});
			}
		}
	});

	router
			.post(
					'/',
					isLoggedIn,
					function(req, res) {
						var id = req.session.userid;
						var predictedTeam = '';
						var predictedPosition = req.body.position;
						var bet = req.body.bet;
						var scoretyp = req.body.scoretyp;
						var scorehemma = req.body.scorehemma;
						var typ = req.body.typ;
						var hemma = req.body.hemma;
						if (scoretyp != null && scoretyp != "") {
							if (scoretyp > scorehemma) {
								predictedTeam = typ;
							} else if (scorehemma > scoretyp) {
								predictedTeam = hemma;
							} else {
								predictedTeam = "none";
							}
						}

						var matchPredictorSingle = new MatchPredictorSingleTeam(
								id, predictedTeam, bet, scoretyp, scorehemma);
						var labyokerMakesBets = new LabyokerMakesBets(id);
						var betsMade;

						matchPredictorSingle
								.setPrediction(function(error, predict) {

									labyokerMakesBets
											.checkIfBetsMade(function(error,
													singleBetsMade) {
												betsMade = singleBetsMade;
												if (predict != null) {

													var successMessage = 'Great job! ';
													if (predictedTeam != null
															&& predictedTeam != '') {
														if (predictedTeam != "none") {
															successMessage += 'You have predicted the winning team to be ';
															successMessage += '<b>'
																	+ predictedTeam
																	+ '</b><br/>';
														} else {
															successMessage += 'It\'s a <b>tie</b>?!! ';
														}
													}
													if (scoretyp != null
															&& scoretyp != "") {
														successMessage += 'Score: <b>'
																+ scoretyp
																+ ' - '
																+ scorehemma
																+ '</b>';
													}

													successMessage += '<br/>Good luck!';

													res
															.render(
																	'index',
																	{
																		title : 'Today\'s Match',
																		matches : req.session.matches,
																		scripts : [
																				'/javascripts/utils.js',
																				'/javascripts/image_preload.js' ],
																		loggedIn : true,
																		labyoker : req.session.user,
																		user : req.session.userid,
																		betsMade : betsMade,
																		placesuccess : predictedPosition,
																		successmessage : successMessage,
																		menu : 'today',
																		moment : moment,
																		now : moment(
																				new Date)
																				.tz(
																						"Europe/Berlin")
																				.format(
																						'YYYY-MM-DD HH:mm:ss')
																	// '2014-06-09
																	// HH:mm:ss'
																	});
												} else {
													res
															.render(
																	'index',
																	{
																		title : 'Today\'s Match',
																		matches : req.session.matches,
																		scripts : [
																				'/javascripts/utils.js',
																				'/javascripts/image_preload.js' ],
																		loggedIn : true,
																		labyoker : req.session.user,
																		user : req.session.userid,
																		betsMade : betsMade,
																		message : 'This match has expired. Please check the calendar for upcoming matches :)',
																		menu : 'today',
																		moment : moment,
																		placeerror : predictedPosition,
																		now : moment(
																				new Date)
																				.tz(
																						"Europe/Berlin")
																				.format(
																						'YYYY-MM-DD HH:mm:ss')
																	});
												}
											});

								});
					});

	router.get('/event/:date', isLoggedIn, function(req, res) {
		var labyokerMakesBets = new LabyokerMakesBets(req.session.userid);
		var betsMade;
		var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD'); // '2014-06-09'

		if (moment(competitionStarts).diff(moment(dateStripped)) <= 0) {

			labyokerMakesBets
					.checkIfBetsMade(function(error, singleBetsMade) {
						var matchEvent = new MatchEvent(req.params.date);
						matchEvent.getMatchOfTheDay(function(error, match) {
							req.session.matchEvent = match;
							res.render('index', {
								title : 'Events held '
										+ moment(req.params.date).endOf('day')
												.fromNow() + ' <br/>' + '['
										+ moment(req.params.date).format('LL')
										+ ']',
								matches : match,
								scripts : [ '/javascripts/utils.js',
										'/javascripts/image_preload.js' ],
								loggedIn : true,
								betsMade : singleBetsMade,
								labyoker : req.session.user,
								user : req.session.userid,
								menu : 'calendar',
								moment : moment,
								now : moment(new Date).tz("Europe/Berlin")
										.format('YYYY-MM-DD HH:mm:ss')
							// '2014-06-09 HH:mm:ss'
							});
						});
					});
		} else {
			res.render('index', {
				title : 'Countdown to the World Cup!!!',
				matches : null,
				loggedIn : true,
				labyoker : req.session.user,
				user : req.session.userid,
				menu : 'today',
				state : 'notstarted',
				startdate : competitionStarts,
				moment : moment,
				now : moment(new Date).tz("Europe/Berlin").format(
						'YYYY-MM-DD HH:mm:ss')
			// '2014-06-09 HH:mm:ss'
			});
		}

	});

	router
			.post(
					'/event/:date',
					isLoggedIn,
					function(req, res) {
						var id = req.session.userid;
						var predictedTeam = '';
						var predictedPosition = req.body.position;
						var bet = req.body.bet;
						var scoretyp = req.body.scoretyp;
						var scorehemma = req.body.scorehemma;
						var typ = req.body.typ;
						var hemma = req.body.hemma;
						if (scoretyp != null && scoretyp != "") {
							if (scoretyp > scorehemma) {
								predictedTeam = typ;
							} else if (scorehemma > scoretyp) {
								predictedTeam = hemma;
							} else {
								predictedTeam = "none";
							}
						}

						var matchPredictorSingle = new MatchPredictorSingleTeam(
								id, predictedTeam, bet, scoretyp, scorehemma);
						var labyokerMakesBets = new LabyokerMakesBets(id);
						var betsMade;

						matchPredictorSingle
								.setPrediction(function(error, predict) {
									
										labyokerMakesBets
												.checkIfBetsMade(function(
														error, singleBetsMade) {

													betsMade = singleBetsMade;
													if (predict != null) {
													var successMessage = 'Great job! ';
													if (predictedTeam != null
															&& predictedTeam != '') {
														if (predictedTeam != "none") {
															successMessage += 'You have predicted the winning team to be ';
															successMessage += '<b>'
																	+ predictedTeam
																	+ '</b><br/>';
														} else {
															successMessage += 'It\'s a <b>tie</b>?!! ';
														}
													}
													if (scoretyp != null
															&& scoretyp != "") {
														successMessage += 'Score: <b>'
																+ scoretyp
																+ ' - '
																+ scorehemma
																+ '</b>';
													}

													successMessage += '<br/>Good luck!';
													res
															.render(
																	'index',
																	{
																		title : 'Events held '
																				+ moment(
																						req.params.date)
																						.endOf(
																								'day')
																						.fromNow()
																				+ ' <br/>'
																				+ '['
																				+ moment(
																						req.params.date)
																						.format(
																								'LL')
																				+ ']',
																		matches : req.session.matchEvent,
																		scripts : [
																				'/javascripts/utils.js',
																				'/javascripts/image_preload.js' ],
																		loggedIn : true,
																		labyoker : req.session.user,
																		user : req.session.userid,
																		betsMade : betsMade,
																		placesuccess : predictedPosition,
																		successmessage : successMessage,
																		menu : 'calendar',
																		moment : moment,
																		now : moment(
																				new Date)
																				.tz(
																						"Europe/Berlin")
																				.format(
																						'YYYY-MM-DD HH:mm:ss')
																	// '2014-06-09
																	// HH:mm:ss'
																	});
													
													} else {
														res
																.render(
																		'index',
																		{
																			title : 'Events held '
																					+ moment(
																							req.params.date)
																							.endOf(
																									'day')
																							.fromNow()
																					+ ' <br/>'
																					+ '['
																					+ moment(
																							req.params.date)
																							.format(
																									'LL')
																					+ ']',
																			matches : req.session.matchEvent,
																			scripts : [
																					'/javascripts/utils.js',
																					'/javascripts/image_preload.js' ],
																			loggedIn : true,
																			labyoker : req.session.user,
																			user : req.session.userid,
																			betsMade : betsMade,
																			menu : 'calendar',
																			message : 'This match has expired. Please check the calendar for upcoming matches :)',
																			moment : moment,
																			placeerror : predictedPosition,
																			now : moment(
																					new Date)
																					.tz(
																							"Europe/Berlin")
																					.format(
																							'YYYY-MM-DD HH:mm:ss')
																		});
													}
												});
									
								});

					});

	router.get('/calendar', isLoggedIn, function(req, res) {

		var matchPhaseStageGroup = new MatchPhase(1);
		var matchPhaseSecondPhase = new MatchPhase(2);
		var matchPhaseQuarters = new MatchPhase(3);
		var matchPhaseSemis = new MatchPhase(4);
		var matchPhaseThird = new MatchPhase(5);
		var matchPhaseFinal = new MatchPhase(6);
		matchPhaseStageGroup.getCalendar(function(error, calendarGroupStage) {
			matchPhaseSecondPhase.getCalendar(function(error,
					calendarSecondPhase) {
				matchPhaseQuarters
						.getCalendar(function(error, calendarQuarters) {
							matchPhaseSemis.getCalendar(function(error,
									calendarSemis) {
								matchPhaseThird.getCalendar(function(error,
										calendarThird) {
									matchPhaseFinal.getCalendar(function(error,
											calendarFinal) {
										res.render('calendar', {
											title : 'Calendar',
											groupPhase : calendarGroupStage,
											secondPhase : calendarSecondPhase,
											quarters : calendarQuarters,
											semis : calendarSemis,
											third : calendarThird,
											finals : calendarFinal,
											loggedIn : true,
											labyoker : req.session.user,
											menu : 'calendar',
											moment : moment,
											now : moment(new Date).tz(
													"Europe/Berlin").format(
													'YYYY-MM-DD HH:mm:ss')
										});
									});
								});
							});
						});
			});
		});
	});

	router.get('/help', /*isLoggedIn,*/ function(req, res) {
		res.render('help', {
			title : 'Help',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
			menu : 'help'
		});

	});

	router.get('/ranking', isLoggedIn, function(req, res) {
		var labyokerMakesBets = new LabyokerMakesBets(req.session.userid);

		labyokerMakesBets.getranking(function(error, labyokersRanking) {
			res.render('ranking', {
				title : "You - v - The Others",
				labyokers : labyokersRanking,
				loggedIn : true,
				userid : req.session.userid,
				scripts : [ '/javascripts/scrolling.js' ],
				labyoker : req.session.user,
				menu : 'ranking'
			});
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
			res.render('login', {});
			req.session.messages = null;

		}
	});

/*	router.get('/search', function(req, res) {
		if (req.session.user) {
			res.render('search', {});
			req.session.messages = null;
		} else {
			res.redirect('/search');
		}
	});
*/

	router.get('/search', function(req, res) {
		if (req.session.user) {
			res.render('search', {loggedIn : true});
			req.session.messages = null;
		} else {
			res.redirect('/login');
		}
	});

	router.get('/orders', function(req, res) {
		if (req.session.user) {
			res.render('orders', {loggedIn : true});
			req.session.messages = null;
		} else {
			res.redirect('/login');
		}
	});

	router.get('/account', function(req, res) {
		if (req.session.user) {
			res.render('account', {loggedIn : true});
			req.session.messages = null;
		} else {
			res.redirect('/login');
		}
	});

	router.get('/share', function(req, res) {
		if (req.session.user) {
			res.render('share', {loggedIn : true, title:'share'});
			req.session.messages = null;
		} else {
			res.redirect('/login');
		}
	});

	router.get('/forgot', function(req, res) {
			res.render('forgot', {});
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
								message : "Ah. We have already sent you an email today to change your password. Please check your inbox.", usernotfound : true, noforgotform: true
							});
					} else {
						res.render(
							'forgot',
							{
								message : "Sorry. We could not find an account with this username. Please try again below.", usernotfound : true
							});
					}
				});
			} else {
				res.render(
					'forgot',
					{
						message : "Sorry. You must enter your current username. Please try again below.", usernotfound : true
					});

			}
			//req.session.messages = null;
	});

	router.get('/register', function(req, res) {
		res.render('register', {});
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
								tel: req.session.tel
						});
				} else if (done != null && done.length > 0 && done != 'success') {
					console.log("status = status1");
					res.render('register', {message : "Sorry. We could not register you. Please try again below."});
				} else if(done != null && done.length > 0 && done == 'success') {
					console.log("status = success1");
					rendered = true;
					console.log("successfully registered " + user_name);
					res.render(
						'register',
						{
							regsuccess : user_name,
							labentered : false
						});
				} else {
					res.render(
						'register',
						{
							message : "Sorry. You cannot proceed. Please try again below."
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
						res.render('register', {message : "Sorry. This email address is already in use. Please use a different one and try again below."});
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
								tel: req.session.tel
							});
					} else if(done != null && done.length > 0 && done != 'success') {
						console.log("status = not successful");
						rendered = true;
						res.render('register', {message : "Sorry. We could not register you. Please try again below."});
					} else if(done != null && done.length > 0 && done == 'success') {
						console.log("status = success");
						rendered = true;
						res.render(
							'register',
							{
								regsuccess : user_name,
								labentered: false
							});
					} else {
						console.log("status = something else happened");
						rendered = true;
						res.render(
							'register',
							{
								message : "Sorry. You cannot proceed. Please try again below."
							});
					}
					if(!rendered){
						console.log("nothing entered");
						res.render('register', {message : "Sorry. We could not register you. Please fill out all fields below."});
					}
				});
			}
	});

	router.post('/search', function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchText;
			if (searchText != null && searchText.length > 0){
				res.render('search', {searchResults : searchText,loggedIn : true});
			} else {
				res.render('search', {loggedIn : true});
			}
			req.session.messages = null;
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
											req.session.active = done[0].active;

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
																		+ " - Forgot Password' target='_top'>Contact us</a> to retrieve it."
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
														+ " - Forgot Password' target='_top'>Contact us</a> to retrieve it."
											});
						}

					});

	router.get('/changepassword/:id', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.render('changepassword', {
			title : 'You & LabYoke',
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
						title : 'You & LabYoke',
						/*loggedIn : true,*/
						messageSuccess : "Congratulations you have successfully changed your Password. Please head to the <a href='/login'>login</a> page.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('changepassword', {
						title : 'You & LabYoke',
						/*loggedIn : true,*/
						displayForm: true,
						message : "An error was found while processing your change password. Please try again or <a href='mailto:labyoke@gmail.com?Subject="
																		+ "Change Password - " + id + "' target='_top'>Contact us</a>.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'dateExpired') {
						res.render('forgot', {
						title : 'You & LabYoke',
						/*loggedIn : true,*/
						message : "Unfortunately your Change Password request has expired. Please make a new request.", 
						displayForm: true,
						scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
					res.render('forgot', {
						title : 'You & LabYoke',
						/*loggedIn : true,*/
						displayForm: true,
						message : "Sorry we could not find your Change Password request. Please make a new request.", 
						scripts : [ '/javascripts/utils.js' ]
					});
			} else {
					res.render('changepassword', {
						title : 'You & LabYoke',
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

	router.get('/admin', isAdmin, function(req, res) {
		var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD'); // '2014-06-09'
		var labyokeFinder = new LabYokeFinder(dateStripped);
		labyokeFinder.getAllTeams(function(error, allteams) {
			labyokeFinder.getAllWinners(function(error, winners) {
				labyokeFinder.getAllMatches(function(error, allmatches) {
					res.render('admin', {
						title : 'Administer Results, Teams & Points',
						loggedIn : true,
						labyoker : req.session.user,
						allteams : allteams,
						matches : allmatches,
						winners : winners,
						moment : moment,
						now : moment(new Date).tz("Europe/Berlin").format(
								'YYYY-MM-DD HH:mm:ss')
					// '2014-06-09 HH:mm:ss'
					});
				});
			});
		});
	});

	router
			.post(
					'/admin',
					isAdmin,
					function(req, res) {
						var team;
						var scoretyp = req.body.scoretyp;
						var scorehemma = req.body.scorehemma;
						var typ = req.body.typ;
						var hemma = req.body.hemma;
						var advanced = req.body.advanced;
						if (scoretyp == scorehemma)
							team = 'none';
						else if (scoretyp > scorehemma)
							team = typ;
						else
							team = hemma;
						if (scoretyp != null) {
							var matchResults = new MatchResults(scoretyp,
									scorehemma, team, req.body.bet, typ, hemma);
							matchResults
									.putResults(function(error, results) {
										matchResults
												.analyzeResults(function(error,
														participantsResults) {

													var dateStripped = moment(
															new Date)
															.tz("Europe/Berlin")
															.format(
																	'YYYY-MM-DD'); // '2014-06-09'
													var labyokeFinder = new LabYokeFinder(
															dateStripped);
													labyokeFinder
															.getAllTeams(function(
																	error,
																	allteams) {
																labyokeFinder
																		.getAllWinners(function(
																				error,
																				winners) {
																			labyokeFinder
																					.getAllMatches(function(
																							error,
																							allmatches) {
																						res
																								.render(
																										'admin',
																										{
																											title : 'Administer Results, Teams & Points',
																											loggedIn : true,
																											labyoker : req.session.user,
																											allteams : allteams,
																											matches : allmatches,
																											winners : winners,
																											moment : moment,
																											now : moment(
																													new Date)
																													.tz(
																															"Europe/Berlin")
																													.format(
																															'YYYY-MM-DD HH:mm:ss'), // '2014-06-09
																											// HH:mm:ss'
																											successmessage : 'You have successfully updated the Game Result <b>'
																													+ typ
																													+ ' v '
																													+ hemma
																													+ '</b> and Points'
																										});
																					});
																		});
															});
												});
									});
						} else if (advanced != null) {
							var matchAdvancing = new MatchAdvancing(
									req.body.advanced, req.body.typorhemma,
									req.body.bet);
							matchAdvancing
									.updateWinner(function(error, results) {
										var dateStripped = moment(new Date).tz(
												"Europe/Berlin").format(
												'YYYY-MM-DD'); // '2014-06-09'
										var labyokeFinder = new LabYokeFinder(
												dateStripped);
										labyokeFinder
												.getAllTeams(function(error,
														allteams) {
													labyokeFinder
															.getAllWinners(function(
																	error,
																	winners) {
																labyokeFinder
																		.getAllMatches(function(
																				error,
																				allmatches) {

																			res
																					.render(
																							'admin',
																							{
																								title : 'Administer Results, Teams & Points',
																								loggedIn : true,
																								labyoker : req.session.user,
																								allteams : allteams,
																								matches : allmatches,
																								winners : winners,
																								moment : moment,
																								now : moment(
																										new Date)
																										.tz(
																												"Europe/Berlin")
																										.format(
																												'YYYY-MM-DD HH:mm:ss'), // '2014-06-09
																								// HH:mm:ss'
																								advancedsuccess : 'You have successfully updated the Advancing team for Match <b>'
																										+ req.body.bet
																										+ '</b>.'
																							});

																		});
															});
												});
									});
						} else {
							res.redirect('/admin');
						}

					});
};
