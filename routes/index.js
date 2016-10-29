var labyokeFinderClass = require('./labyokefinder');
var dates = require('../config/staticvariables');
var LabYokeFinder = labyokeFinderClass.LabYokeFinder;
var MatchPredictorSingleTeam = labyokeFinderClass.MatchPredictorSingleTeam;
var NetlighterMakesBet = labyokeFinderClass.NetlighterMakesBet;
var NetlighterMakesBets = labyokeFinderClass.NetlighterMakesBets;
var MatchPhase = labyokeFinderClass.MatchPhase;
var Netlighter = labyokeFinderClass.Netlighter;
var MatchResults = labyokeFinderClass.MatchResults;
var MatchAdvancing = labyokeFinderClass.MatchAdvancing;
var moment = require('moment-timezone');

var express = require('express');
var router = express.Router();

module.exports = function(router) {

	var competitionStarts = dates.competitionStarts;
	var competitionEnds = dates.competitionEnds;

	router.get('/', isLoggedIn, function(req, res) {

		var netlighterMakesBets = new NetlighterMakesBets(req.session.userid);
		var betsMade;
		var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD'); // '2014-06-09'

		if (moment(competitionEnds).diff(moment(dateStripped)) < 0) {
			netlighterMakesBets.getranking(function(error, ranking) {
				res.render('index', {
					title : 'The World Cup has ended!',
					matches : null,
					loggedIn : true,
					netlighter : req.session.user,
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
				netlighterMakesBets.checkIfBetsMade(function(error,
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
								netlighter : req.session.user,
								user : req.session.userid,
								menu : 'today',
								moment : moment,
								now : moment(new Date).tz("Europe/Berlin")
										.format('YYYY-MM-DD HH:mm:ss')
							// '2014-06-09 HH:mm:ss'
							});
						} else {
							netlighterMakesBets.getranking(function(error,
									ranking) {
								res.render('index', {
									title : 'Rest Day',
									matches : null,
									loggedIn : true,
									netlighter : req.session.user,
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
					netlighter : req.session.user,
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
						var netlighterMakesBets = new NetlighterMakesBets(id);
						var betsMade;

						matchPredictorSingle
								.setPrediction(function(error, predict) {

									netlighterMakesBets
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
																		netlighter : req.session.user,
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
																		netlighter : req.session.user,
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
		var netlighterMakesBets = new NetlighterMakesBets(req.session.userid);
		var betsMade;
		var dateStripped = moment(new Date).tz("Europe/Berlin").format(
				'YYYY-MM-DD'); // '2014-06-09'

		if (moment(competitionStarts).diff(moment(dateStripped)) <= 0) {

			netlighterMakesBets
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
								netlighter : req.session.user,
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
				netlighter : req.session.user,
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
						var netlighterMakesBets = new NetlighterMakesBets(id);
						var betsMade;

						matchPredictorSingle
								.setPrediction(function(error, predict) {
									
										netlighterMakesBets
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
																		netlighter : req.session.user,
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
																			netlighter : req.session.user,
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
											netlighter : req.session.user,
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

	router.get('/help', isLoggedIn, function(req, res) {
		res.render('help', {
			title : 'You & LabYoke',
			loggedIn : true,
			netlighter : req.session.user,
			menu : 'help'
		});

	});

	router.get('/ranking', isLoggedIn, function(req, res) {
		var netlighterMakesBets = new NetlighterMakesBets(req.session.userid);

		netlighterMakesBets.getranking(function(error, netlightersRanking) {
			res.render('ranking', {
				title : "You - v - The Others",
				netlighters : netlightersRanking,
				loggedIn : true,
				userid : req.session.userid,
				scripts : [ '/javascripts/scrolling.js' ],
				netlighter : req.session.user,
				menu : 'ranking'
			});
		});
	});

	router.get('/logout', function(req, res) {
		req.logout();
		req.session.user = null;
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
			res.render('search', {});
			req.session.messages = null;
		} else {
			res.redirect('/login');
		}
	});

	router.get('/register', function(req, res) {
		res.render('register', {});
		req.session.messages = null;
	});

	router.post('/register', function(req, res) {

		if (req.body.reglab) {
			var reglab = req.body.reglab;
			if (reglab != null && reglab.length > 0){
				res.render('register', {labentered : reglab});
			} else {
				res.render('register', {});
			}
		} else {
			res.render('register', {});
		}

	});

	router.post('/search', function(req, res) {
		if (req.session.user) {
			var searchText = req.body.searchText;
			if (searchText != null && searchText.length > 0){
				res.render('search', {searchResults : searchText});
			} else {
				res.render('search', {});
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
							var netlighter = new Netlighter(username, password);

							netlighter
									.login(function(error, done) {

										if (done != null && done.length > 0) {
											req.session.user = done[0].name;
											req.session.userid = done[0].id;
											req.session.active = done[0].active;

											if (done[0].active == 0) {

												return res
														.redirect('/changepassword');
											}

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

	router.get('/changepassword', isLoggedInAndNotActive, function(req, res) {
		res.render('changepassword', {
			title : 'You & LabYoke',
			loggedIn : true,
			netlighter : req.session.user,
			scripts : [ '/javascripts/utils.js' ]
		});
	});

	router.post('/changepassword', isLoggedIn, function(req, res) {
		var netlighter = new Netlighter(req.session.userid, req.body.pass);

		netlighter.changepassword(function(error, done) {
			if (done != null) {
				res.redirect('/');
			}
		});
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
						netlighter : req.session.user,
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
																											netlighter : req.session.user,
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
																								netlighter : req.session.user,
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
