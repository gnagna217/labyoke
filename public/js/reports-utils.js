console.log("recenter: ") + recenter;


				console.log("recenter: " + recenter);
				if(recenter == 0){
				var wi = $(window).width();
				console.log("wi is: " + wi);

				$(function(){
				$.fn.center = function () {
				if(!$('.reportMoney').is(':visible') && !$('.reportShares').is(':visible') && !$('.reportInsuff').is(':visible') && !$('.reportOrders').is(':visible')){
				console.log("results visible ");
				this.removeAttr( "style" );
				var t = ($(window).height() - this.height()) / 2 ; 
				console.log("t login: " + t);
				console.log("$(window).height(): " + $(window).height());
				console.log("this.height() login: " + this.height());
				
				if(wi>440 && t > 25){
				console.log("inside t");
				this.css("margin-top",  t + "px");
				this.css("-webkit-transition","all .5s ease");
				this.css("transition","all .5s ease");
				}
				}
				return this;
				}

				$(".reportlabels2").center(); 
				
				$(".containerreports").css("display", "block");                         

				$(window).resize(function(){ 
					if(wi>440 && recenter==0){
						$(".reportlabels2").center();
					}
				});                          

				});

				} else {
				$(".containerreports").css("display", "block");
				}


			$(document).ready(function(){


var h = $(window).height() - 125;
          $(".marginbottom").css("min-height",h);

			var labelcheck = document.querySelector(".labelcheck");
			console.log("labelcheck: " + labelcheck);
			if(labelcheck != undefined && labelcheck != null){
				console.debug(labelcheck);
				labelcheck.addEventListener("click", function() {
				labelcheck.classList.toggle("bordercolorreport");
				});
			}






				

					console.log( "reports document loaded" );
					if ($("#checkdisplay").css("display") == "none" ){
						$('.slide-out-tip-div').hide();
					} else {
						$('.slide-out-tip-div').show();
					}	


/* Start Toggle Report Buttons and handles 
******************************************
******************************************
*/

						$( ".labelexpand" ).click(function() {
						
						recenter = 1;
						
						if($('#reportMoney').is(':visible')){
							$(".reportlabels").removeClass("reportlabels2");
							$(".labelexpandmood").css("top","-44px");
						} else {
							$(".alert").hide();
							$(".reportlabels").addClass("reportlabels2");
							if($(window).width() > 900){
								$(".labelexpandmood").css("top","0px");
							}
						}
						
						$(".reportlabels").removeClass("animated fadeIn");

						if($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900){
						console.log("apply animated");
						$(".reportlabels").addClass("animated fadeIn");
						}

						//$("#reportMoney").toggleClass("animated fadeInUp");

						$( this ).toggleClass( "highlightlabel" );
						//$('.containerreport').hide();
						$('.labelexpandedit').removeClass( "highlightlabel" );
						$('.labelexpandadd').removeClass( "highlightlabel" );
						$('.labelexpandrules').removeClass( "highlightlabel" );
						$('.labelexpandmood').removeClass( "highlightlabel" );

						$(".containerreports").removeAttr( "style" );

						$('.intro').hide();
						$('.desktabonly3').hide();
						$('.intro2').hide();
						//$('.pin').hide();
						//$('.pulse').hide();
						$('.labeldownload').hide();
						$('#reportMoney').toggle();
						$('#reportShares').hide();
						$('#reportOrders').hide();
						$('#reportInsuff').hide();

						var l = $('#reportMoney').offset().top;
						if(l>100){
							l -= 100;
						}

						$('.threedown').show();
						console.log("threedown show");
						console.log("scrolling " + l);
						$('html,body').animate({scrollTop: l}, 1000);
						});

						//$( ".labelexpandedit" ).on("click touchend", function(e) {
						$( ".labelexpandedit" ).click(function() {
							recenter = 1;
							
							if($('#reportOrders').is(':visible')){
								$(".reportlabels").removeClass("reportlabels2");
								$(".labelexpandmood").css("top","-44px");
								
								console.log("threedown show");
							} else {
							$(".alert").hide("");
							
								$(".reportlabels").addClass("reportlabels2");
								if($(window).width() > 900){
								$(".labelexpandmood").css("top","0px");
								}
							}
							$(".reportlabels").removeClass("animated fadeIn");

							if($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900){
								console.log("apply animated");
								$(".reportlabels").addClass("animated fadeIn");
							}
						
							//$("#reportOrders").toggleClass("animated fadeInUp");
							$( this ).toggleClass( "highlightlabel" );
							//$('.containerreport').hide();
						$('.labelexpand').removeClass( "highlightlabel" );
						$('.labelexpandadd').removeClass( "highlightlabel" );
						$('.labelexpandrules').removeClass( "highlightlabel" );
						$('.labelexpandmood').removeClass( "highlightlabel" );
							
							$(".containerreports").removeAttr( "style" );

							$('.intro').hide();
							$('.intro2').hide();
							//$('.pin').hide();
						//$('.pulse').hide();
							$('.desktabonly3').hide();
							$('.labeldownload').hide();
							$('#reportOrders').toggle();
							$('#reportShares').hide();
							$('#reportMoney').hide();
							$('#reportInsuff').hide();
						var l = $('#reportOrders').offset().top;
						if(l>100){
							l -= 100;
						}
						$('.threedown').show();
						console.log("scrolling " + l);
						$('html,body').animate({scrollTop: l}, 1000);
						});

						//$( ".labelexpandadd" ).on("click touchend", function(e) {
						$( ".labelexpandadd" ).click(function() {
						recenter = 1;
						
						if($('#reportShares').is(':visible')){
							$(".reportlabels").removeClass("reportlabels2");
							$(".labelexpandmood").css("top","-44px");
						} else {
						$(".alert").hide();
						
							$(".reportlabels").addClass("reportlabels2");
							if($(window).width() > 900){
								$(".labelexpandmood").css("top","0px");
							}
						}
							$(".reportlabels").removeClass("animated fadeIn");

							if($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900){
								console.log("apply animated");
								$(".reportlabels").addClass("animated fadeIn");
							}
						
							//$("#reportShares").toggleClass("animated fadeInUp");

							$( this ).toggleClass( "highlightlabel" );
							//$('.containerreport').hide();

						$('.labelexpandedit').removeClass( "highlightlabel" );
						$('.labelexpand').removeClass( "highlightlabel" );
						$('.labelexpandrules').removeClass( "highlightlabel" );
						$('.labelexpandmood').removeClass( "highlightlabel" );
							
							$(".containerreports").removeAttr( "style" );
							$('.intro').hide();
							$('.desktabonly3').hide();
							$('.intro2').hide();
							//$('.pin').hide();
						//$('.pulse').hide();
							$('.labeldownload').hide();
							$('#reportShares').toggle();
							$('#reportMoney').hide();
							$('#reportOrders').hide();
							$('#reportInsuff').hide();
							var l = $('#reportShares').offset().top;
						if(l>100){
							l -= 100;
						}
						$('.threedown').show();
						console.log("scrolling " + l);
						$('html,body').animate({scrollTop: l}, 1000);
						});

						//$( ".labelexpandrules" ).on("click touchend", function(e) {
						$( ".labelexpandrules" ).click(function() {
						recenter = 1;
						
						if($('#reportInsuff').is(':visible')){
							$(".reportlabels").removeClass("reportlabels2");
							$(".labelexpandmood").css("top","-44px");
						} else {
						$(".alert").hide();
						
							$(".reportlabels").addClass("reportlabels2");
							if($(window).width() > 900){
								$(".labelexpandmood").css("top","0px");
							}
						}
							$(".reportlabels").removeClass("animated fadeIn");

							if($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900){
								console.log("apply animated");
								$(".reportlabels").addClass("animated fadeIn");
							}

							$( this ).toggleClass( "highlightlabel" );
							//$('.containerreport').hide();
						$('.labelexpandedit').removeClass( "highlightlabel" );
						$('.labelexpandadd').removeClass( "highlightlabel" );
						$('.labelexpand').removeClass( "highlightlabel" );
						$('.labelexpandmood').removeClass( "highlightlabel" );
							
							$(".containerreports").removeAttr( "style" );
							$('.intro').hide();
							$('.desktabonly3').hide();
							$('.intro2').hide();
							//$('.pin').hide();
						//$('.pulse').hide();
							$('.labeldownload').hide();
							$('#reportInsuff').toggle();
							$('#reportShares').hide();
							$('#reportOrders').hide();
							$('#reportMoney').hide();
							var l = $('#reportInsuff').offset().top;
						if(l>100){
							l -= 100;
						}
						$('.threedown').show();
						console.log("scrolling " + l);
						$('html,body').animate({scrollTop: l}, 1000);
						});

						$( ".labelexpandmood" ).click(function() {
						recenter = 1;
							$(".alert").hide();
							$(".reportlabels").removeClass("reportlabels2");
							$(".labelexpandmood").css("top","-44px");
						
						$('#reportOrders').hide();
						$('#reportShares').hide();
						$('#reportMoney').hide();
						$('#reportInsuff').hide();
						$('.intro').hide();
						
						$('.intro2').hide();
						$('.labeldownload').hide();
						$( this ).toggleClass( "highlightlabel" );
						$('.labelexpandedit').removeClass( "highlightlabel" );
						$('.labelexpandadd').removeClass( "highlightlabel" );
						$('.labelexpand').removeClass( "highlightlabel" );
						$('.labelexpandrules').removeClass( "highlightlabel" );
						if ( !$( ".checkintro" ).hasClass( "noshow" ) ) {
						console.log("clicked week intro: " +  var_resultsMoneyIntro);
						
						recenter = 1;
						var ob = var_resultsMoneyIntro
						ob = ob.replace(/&lt;/g,"<");
						ob = ob.replace(/&gt;/g,">");
						var pdf2 = new jsPDF('l', 'pt', 'letter');
						pdf2.setFont("courier", "normal");
						pdf2.setFontSize(10);
						source = ob;

						$(".intro2").show();
						$(".intro2").addClass("backintro");
						//$('.pin').show();
						//$('.pulse').show();
						$(".intro2").html(source);
						$('.desktabonly3').show();

						setTimeout(function(){
						console.log("height insuff is: " + $('.containerreports').height());
						console.log("top insuff is: " + $('.containerreports').offset().top);
						console.log("report insuff height is: " + $('.reportlabels').height());
						console.log("report insuff top is: " + $('.reportlabels').offset().top);
						var l = $('.containerreports').offset().top + $('.containerreports').height();
						console.log("scrolling " + l);
						$('html,body').animate({scrollTop: l}, 1000);
						}, 500);

						if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
						console.log("ismobile");
						$('.intro2').css("margin-right","0px");
						$('.intro2').css("margin-left","0px");
						$('.threedown').hide();
						console.log("threedown hide");
						} else {
							console.log("isdesktop");
						var dataintro = var_dataIntro;

						if(dataintro != null && dataintro != ""){
						$(".intro2").before("<label for='togglerules' id='labeldownload' class='labeldownload animated fadeInUp' data-toggle='tooltip' title='" + var_reports_download_pdf + "'><span class='fa fa-download'></span></label><label for='togglerules' id='labeldownloadxl' class='labeldownload animated fadeInUp labeldownloadxl' data-toggle='tooltip' title='" + var_reports_download_excel + "'><span class='fa fa-database'></span></label>");

						var filetext = var_reports_download_today;

						$(".intro2").prev('#labeldownloadxl').click(function() {
							/* original data */
							
							var data = JSON.parse('!{dataIntro}');
							console.dir(data);
							var ws_name = "SheetJS";

							var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

							/* add worksheet to workbook */
							wb.SheetNames.push(ws_name);
							wb.Sheets[ws_name] = ws;
							var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
							saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filetext + ".xlsx")										
						});
						$(".intro2").prev().prev('#labeldownload').click(function() {
						recenter = 1;
											
						console.log(source);
						var options = {
							background: '#fff'
						};

						pdf2.addHTML($(".intro2"),options,function() {
							console.log("source weekly savings");
							
							pdf2.save(filetext + ".pdf");
							$('.checkintro').addClass("noshow");
						});
						});
						} else { 
						console.log("dataintro is empty");
							$('.intro2').css("margin-right","0px");
							$('.intro2').css("margin-left","0px");
						} //end check dataintro

						}

						} else {
							$('.checkintro').removeClass("noshow");
						}
						});	

/* End Toggle Report Buttons and handles 
******************************************
******************************************
*/



						//if (addMessageMoney != null)
						if($('.alert').is(':visible')){
									recenter = 1;

									$(".reportlabels").addClass("reportlabels2");
									if($(window).width() > 900){
										$(".labelexpandmood").css("top","0px");
									}
								}
if($('.alert-shares').is(':visible')){$('.labelexpand').addClass( "highlightlabel" );}
if($('.alert-orders').is(':visible')){$('.labelexpandedit').addClass( "highlightlabel" );}
if($('.alert-insuff').is(':visible')){$('.labelexpandrules').addClass( "highlightlabel" );}
if($('.alert-inv').is(':visible')){$('.labelexpandadd').addClass( "highlightlabel" );}



				});
				

					window.onload = function() {
					$('#reportMoney').hide();
					$('#reportShares').hide();
					$('#reportOrders').hide();
					$('#reportInsuff').hide();

					var eSelect = document.getElementById('reportSelect');
					console.debug("selected: " + $('#reportSelect').val());

					if(eSelect.selectedIndex === 1 || $('#reportSelect').val() == 'reportMoney') {
						console.log("resultsMoney inside");
						$('.containerreport').hide();
						$('#reportMoney').show();
						$('#reportShares').hide();
						$('#reportOrders').hide();
						$('#reportInsuff').hide();
						$(window).scrollTop($('#reportMoney').offset().top - 100).scrollLeft($('#reportMoney').offset().left);
					} else if(eSelect.selectedIndex === 2 || $('#reportSelect').val() == 'reportOrders') {
						console.log("resultsOrders inside");
						$('.containerreport').hide();
						$('#reportOrders').show();
						$('#reportShares').hide();
						$('#reportMoney').hide();
						$('#reportInsuff').hide();
						$(window).scrollTop($('#reportOrders').offset().top - 100).scrollLeft($('#reportOrders').offset().left);
					} else if(eSelect.selectedIndex === 3 || $('#reportSelect').val() == 'reportShares') {
						console.log("resultsShares inside");
						$('.containerreport').hide();
						$('#reportShares').show();
						$('#reportMoney').hide();
						$('#reportOrders').hide();
						$('#reportInsuff').hide();
						$(window).scrollTop($('#reportShares').offset().top - 100).scrollLeft($('#reportShares').offset().left);
					} else if(eSelect.selectedIndex === 4 || $('#reportSelect').val() == 'reportInsuff') {
						console.log("resultsInsuff inside");
						$('.containerreport').hide();
						$('#reportInsuff').show();
						$('#reportShares').hide();
						$('#reportOrders').hide();
						$('#reportMoney').hide();
						$(window).scrollTop($('#reportInsuff').offset().top - 100).scrollLeft($('#reportInsuff').offset().left);
					} else if(eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'reportNone') {
						console.log("result None inside");
						$('.containerreport').show();
						$('#reportInsuff').hide();
						$('#reportShares').hide();
						$('#reportOrders').hide();
						$('#reportMoney').hide();
					}

						eSelect.onchange = function() {
							if(eSelect.selectedIndex === 1 || $('#reportSelect').val() == 'reportMoney') {
								console.log("resultsMoney inside");
								$('.containerreport').hide();
								$('#reportMoney').show();
								$('#reportShares').hide();
								$('#reportOrders').hide();
								$('#reportInsuff').hide();
							} else if(eSelect.selectedIndex === 2 || $('#reportSelect').val() == 'reportOrders') {
								console.log("resultsOrders inside");
								$('.containerreport').hide();
								$('#reportOrders').show();
								$('#reportShares').hide();
								$('#reportMoney').hide();
								$('#reportInsuff').hide();
							} else if(eSelect.selectedIndex === 3 || $('#reportSelect').val() == 'reportShares') {
								console.log("resultsShares inside");
								$('.containerreport').hide();
								$('#reportShares').show();
								$('#reportMoney').hide();
								$('#reportOrders').hide();
								$('#reportInsuff').hide();
							}else if(eSelect.selectedIndex === 4 || $('#reportSelect').val() == 'reportInsuff') {
								console.log("resultsInsuff inside");
								$('.containerreport').hide();
								$('#reportInsuff').show();
								$('#reportShares').hide();
								$('#reportOrders').hide();
								$('#reportMoney').hide();
							} else if(eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'reportNone') {
								console.log("result None inside");
								$('.containerreport').show();
								$('#reportInsuff').hide();
								$('#reportShares').hide();
								$('#reportOrders').hide();
								$('#reportMoney').hide();
							}
						}


						var checkedstrMoney = "#{checkedstrMoney}";
					if(checkedstrMoney == "true"){
						console.log("section checkedstrMoney");
						$('.containerreport').hide();
						$('#reportShares').hide();
						$('#reportMoney').show();
						$('#reportOrders').hide();
						$('#reportInsuff').hide();
						$(window).scrollTop($('#reportMoney').offset().top - 100).scrollLeft($('#reportMoney').offset().left);
						}
					var checkedstrOrders = "#{checkedstrOrders}";
					if(checkedstrOrders == "true"){
						console.log("section checkedstrOrders");
						$('.containerreport').hide();
						$('#reportShares').hide();
						$('#reportMoney').hide();
						$('#reportOrders').show();
						$('#reportInsuff').hide();
						$(window).scrollTop($('#reportOrders').offset().top - 100).scrollLeft($('#reportOrders').offset().left);
						}
					var checkedstrShares = "#{checkedstrShares}";
					if(checkedstrShares == "true"){
						console.log("section checkedstrShares");
						$('.containerreport').hide();
						$('#reportShares').show();
						$('#reportMoney').hide();
						$('#reportOrders').hide();
						$('#reportInsuff').hide();
						$(window).scrollTop($('#reportShares').offset().top - 100).scrollLeft($('#reportShares').offset().left);
						}
					var checkedstrInsuff = "#{checkedstrInsuff}";
					if(checkedstrInsuff == "true"){
						console.log("section checkedstrInsuff");
						$('.containerreport').hide();
						$('#reportShares').hide();
						$('#reportMoney').hide();
						$('#reportOrders').hide();
						$('#reportInsuff').show();
						$(window).scrollTop($('#reportInsuff').offset().top - 100).scrollLeft($('#reportInsuff').offset().left);
						}
					};