console.log("recenter: ") + recenter;


console.log("recenter: " + recenter);

$('.intro2').addClass("intro3");
if (recenter == 0) {
    var wi = $(window).width();
    console.log("wi is: " + wi);

    $(function() {
        $.fn.center = function() {
            if (!$('.reportMoney').is(':visible') && !$('.reportShares').is(':visible') && !$('.reportInsuff').is(':visible') && !$('.reportOrders').is(':visible')) {
                console.log("results visible ");
                this.removeAttr("style");
                var t = ($(window).height() - this.height()) / 6;
                console.log("t login: " + t);
                console.log("$(window).height(): " + $(window).height());
                console.log("this.height() login: " + this.height());

                if (wi > 440 && t > 25) {
                    console.log("inside t");
                    this.css("margin-top", t + "px");
                    this.css("-webkit-transition", "all .5s ease");
                    this.css("transition", "all .5s ease");
                }
            }
            return this;
        }

        $(".reportlabels2").center();

        $(".containerreports").css("display", "block");

        $(window).resize(function() {
            if (wi > 440 && recenter == 0) {
                $(".reportlabels2").center();
            }

        if (!$('#reportMoney').is(':visible') && !$('#reportInsuff').is(':visible') && !$('#reportOrders').is(':visible') && !$('#reportShares').is(':visible') ) {
            console.log("report visible");

            if ($(window).width() > 701) {
               $(".labelexpandmood").css("top", "-44px");
            } else {
                $(".labelexpandmood").css("top", "0px");
            }
        } else{
            console.log("report forms visible");
            if ($(window).width() < 900 && $(window).width() > 701) {
               $(".labelexpandmood").css("top", "-44px");
            } else {
                $(".labelexpandmood").css("top", "0px");
            }
            
        }
        });

    });

} else {
    $(".containerreports").css("display", "block");
}

$(window).resize(function() {
      var field = $(document.activeElement);
      if (field.is('.hasDatepicker')) {
      	console.log("found hasDatepicker");
            field.datepicker('hide');
      }
});

$(document).ready(function() {

$("#reportDateFrom").click(function() {
            console.log("date visible");
            $("#ui-datepicker-div").width($("#reportDateFrom").width()+"px");
});
$("#reportDateTo").click(function() {
            console.log("date visible");
            $("#ui-datepicker-div").width($("#reportDateTo").width()+"px");
});


	    if (!$('#reportMoney').is(':visible') && !$('#reportInsuff').is(':visible') && !$('#reportOrders').is(':visible') && !$('#reportShares').is(':visible') ) {
            console.log("report visible");

            if ($(window).width() > 701) {
               $(".labelexpandmood").css("top", "-44px");
            } else {
                $(".labelexpandmood").css("top", "0px");
            }
        } else{
            console.log("report forms visible");
            if ($(window).width() > 701 && $(window).width() < 900) {
               $(".labelexpandmood").css("top", "0px");
            }
        	
        }

	$( ".adddatepicker" ).datepicker({
		showOn: "both", 
		buttonText: "<span class='fa fa-calendar reports-calendar'></span>",
		nextText: ">>",
		prevText: "<<",
		dateFormat: "mm-dd-yy",
		dayNamesMin: [ var_sunday_min , var_monday_min, var_tuesday_min , var_wednesday_min, var_thursday_min, var_friday_min, var_saturday_min ],
		monthNames: [ var_month0 , var_month1, var_month2 , var_month3, var_month4, var_month5, var_month6, var_month7, var_month8, var_month9, var_month10, var_month11 ]
	});

	//$(".adddatepicker").datepicker().datepicker("setDate", new Date());


    $("#reportDateFrom").mask("99-99-9999", {
        placeholder: "mm-dd-yyyy"
    });
    $("#reportDateTo").mask("99-99-9999", {
        placeholder: "mm-dd-yyyy"
    });
    $("#reportDateFromOrders").mask("99-99-9999", {
        placeholder: "mm-dd-yyyy"
    });
    $("#reportDateToOrders").mask("99-99-9999", {
        placeholder: "mm-dd-yyyy"
    });
    $("#reportDateFromMoney").mask("99-99-9999", {
        placeholder: "mm-dd-yyyy"
    });
    $("#reportDateToMoney").mask("99-99-9999", {
        placeholder: "mm-dd-yyyy"
    });

    var h = $(window).height() - 125;
    $(".marginbottom").css("min-height", h);

    var labelcheck = document.querySelector(".labelcheck");
    console.log("labelcheck: " + labelcheck);
    if (labelcheck != undefined && labelcheck != null) {
        console.debug(labelcheck);
        labelcheck.addEventListener("click", function() {
            labelcheck.classList.toggle("bordercolorreport");
        });
    }




    console.log("reports document loaded");
    if ($("#checkdisplay").css("display") == "none") {
        $('.slide-out-tip-div').hide();
    } else {
        $('.slide-out-tip-div').show();
    }


    /* Start Toggle Report Buttons and handles 
     ******************************************
     ******************************************
     */

    $(".labelexpand").click(function() {
$('.restrictreport').show();
        recenter = 1;

        if ($('#reportMoney').is(':visible')) {
            $(".reportlabels").removeClass("reportlabels2");
            $(".labelexpandmood").css("top", "0px");
        } else {
            $(".alert").hide();
            $(".reportlabels").addClass("reportlabels2");
            if ($(window).width() > 900) {
                $(".labelexpandmood").css("top", "0px");
            }
        }

        $(".reportlabels").removeClass("animated fadeIn");

        if ($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900) {
            console.log("apply animated");
            $(".reportlabels").addClass("animated fadeIn");
        }

        //$("#reportMoney").toggleClass("animated fadeInUp");

        $(this).toggleClass("highlightlabel");
        //$('.containerreport').hide();
        $('.labelexpandedit').removeClass("highlightlabel");
        $('.labelexpandadd').removeClass("highlightlabel");
        $('.labelexpandrules').removeClass("highlightlabel");
        $('.labelexpandmood').removeClass("highlightlabel");

        $(".containerreports").removeAttr("style");

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
        if (l > 100) {
            l -= 100;
        }

        $('.threedown').show();
        console.log("threedown show");
        console.log("scrolling " + l);
        $('html,body').animate({
            scrollTop: l
        }, 1000);
    });

    //$( ".labelexpandedit" ).on("click touchend", function(e) {
    $(".labelexpandedit").click(function() {
        $('.restrictreport').show();
        recenter = 1;

        if ($('#reportOrders').is(':visible')) {
            $(".reportlabels").removeClass("reportlabels2");
            $(".labelexpandmood").css("top", "0px");

            console.log("threedown show");
        } else {
            $(".alert").hide("");

            $(".reportlabels").addClass("reportlabels2");
            if ($(window).width() > 900) {
                $(".labelexpandmood").css("top", "0px");
            }
        }
        $(".reportlabels").removeClass("animated fadeIn");

        if ($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900) {
            console.log("apply animated");
            $(".reportlabels").addClass("animated fadeIn");
        }

        //$("#reportOrders").toggleClass("animated fadeInUp");
        $(this).toggleClass("highlightlabel");
        //$('.containerreport').hide();
        $('.labelexpand').removeClass("highlightlabel");
        $('.labelexpandadd').removeClass("highlightlabel");
        $('.labelexpandrules').removeClass("highlightlabel");
        $('.labelexpandmood').removeClass("highlightlabel");

        $(".containerreports").removeAttr("style");

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
        if (l > 100) {
            l -= 100;
        }
        $('.threedown').show();
        console.log("scrolling " + l);
        $('html,body').animate({
            scrollTop: l
        }, 1000);
    });

    //$( ".labelexpandadd" ).on("click touchend", function(e) {
    $(".labelexpandadd").click(function() {
        $('.restrictreport').show();
        recenter = 1;

        if ($('#reportShares').is(':visible')) {
            $(".reportlabels").removeClass("reportlabels2");
            $(".labelexpandmood").css("top", "0px");
        } else {
            $(".alert").hide();

            $(".reportlabels").addClass("reportlabels2");
            if ($(window).width() > 900) {
                $(".labelexpandmood").css("top", "0px");
            }
        }
        $(".reportlabels").removeClass("animated fadeIn");

        if ($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900) {
            console.log("apply animated");
            $(".reportlabels").addClass("animated fadeIn");
        }

        //$("#reportShares").toggleClass("animated fadeInUp");

        $(this).toggleClass("highlightlabel");
        //$('.containerreport').hide();

        $('.labelexpandedit').removeClass("highlightlabel");
        $('.labelexpand').removeClass("highlightlabel");
        $('.labelexpandrules').removeClass("highlightlabel");
        $('.labelexpandmood').removeClass("highlightlabel");

        $(".containerreports").removeAttr("style");
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
        if (l > 100) {
            l -= 100;
        }
        $('.threedown').show();
        console.log("scrolling " + l);
        $('html,body').animate({
            scrollTop: l
        }, 1000);
    });

    //$( ".labelexpandrules" ).on("click touchend", function(e) {
    $(".labelexpandrules").click(function() {
        $('.restrictreport').show();
        recenter = 1;

        if ($('#reportInsuff').is(':visible')) {
            $(".reportlabels").removeClass("reportlabels2");
            $(".labelexpandmood").css("top", "0px");
        } else {
            $(".alert").hide();

            $(".reportlabels").addClass("reportlabels2");
            if ($(window).width() > 900) {
                $(".labelexpandmood").css("top", "0px");
            }
        }
        $(".reportlabels").removeClass("animated fadeIn");

        if ($('#reportMoney').is(':hidden') && $('#reportOrders').is(':hidden') && $('#reportShares').is(':hidden') && $('#reportInsuff').is(':hidden') && $(window).width() > 900) {
            console.log("apply animated");
            $(".reportlabels").addClass("animated fadeIn");
        }

        $(this).toggleClass("highlightlabel");
        //$('.containerreport').hide();
        $('.labelexpandedit').removeClass("highlightlabel");
        $('.labelexpandadd').removeClass("highlightlabel");
        $('.labelexpand').removeClass("highlightlabel");
        $('.labelexpandmood').removeClass("highlightlabel");

        $(".containerreports").removeAttr("style");
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
        if (l > 100) {
            l -= 100;
        }
        $('.threedown').show();
        console.log("scrolling " + l);
        $('html,body').animate({
            scrollTop: l
        }, 1000);
    });

    $(".labelexpandmood").click(function() {
        recenter = 1;
        $(".alert").hide();
        $(".reportlabels").removeClass("reportlabels2");
        $(".labelexpandmood").css("top", "-44px");

        $('#reportOrders').hide();
        $('#reportShares').hide();
        $('#reportMoney').hide();
        $('#reportInsuff').hide();
        $('.intro').hide();

        $('.intro2').hide();
        $('.labeldownload').hide();
        $(this).toggleClass("highlightlabel");
        $('.labelexpandedit').removeClass("highlightlabel");
        $('.labelexpandadd').removeClass("highlightlabel");
        $('.labelexpand').removeClass("highlightlabel");
        $('.labelexpandrules').removeClass("highlightlabel");
        if (!$(".checkintro").hasClass("noshow")) {
            console.log("clicked week intro: " + var_resultsMoneyIntro);

            recenter = 1;
            var ob = var_resultsMoneyIntro
            ob = ob.replace(/&lt;/g, "<");
            ob = ob.replace(/&gt;/g, ">");
            var pdf2 = new jsPDF('p', 'pt', 'letter');
            pdf2.setFont("courier", "normal");
            pdf2.setFontSize(10);
            source = ob;


            
            $(".intro2").show();
            $(".intro2").addClass("backintro");
            //$('.pin').show();
            //$('.pulse').show();
            $(".intro2").html(source);
            $('.desktabonly3').show();

            setTimeout(function() {
                console.log("height insuff is: " + $('.containerreports').height());
                console.log("top insuff is: " + $('.containerreports').offset().top);
                console.log("report insuff height is: " + $('.reportlabels').height());
                console.log("report insuff top is: " + $('.reportlabels').offset().top);
                var l = $('.containerreports').offset().top + $('.containerreports').height();
                console.log("scrolling " + l);
                $('html,body').animate({
                    scrollTop: l
                }, 1000);
            }, 500);

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                console.log("ismobile");
                $('.intro2').css("margin-right", "0px");
                $('.intro2').css("margin-left", "0px");
                $('.threedown').hide();
                console.log("threedown hide");
            } else {
                console.log("isdesktop");
                var dataintro = var_dataIntro;
                //console.dir(JSON.parse(dataintro));
                if (dataintro != null && dataintro != "") {
                    $(".intro2").before("<label for='togglerules' id='labeldownload' class='labeldownload animated fadeInUp' data-toggle='tooltip' title='" + var_reports_download_pdf + "'><span class='fa fa-download'></span><span class='fa fa-check displaynone-impt check-download-report checkpdf'></span></label><label for='togglerules' id='labeldownloadxl' class='labeldownload animated fadeInUp labeldownloadxl' data-toggle='tooltip' title='" + var_reports_download_excel + "'><span class='fa fa-database'></span><span class='fa fa-check displaynone-impt check-download-report check-xcel'></span></label>");

                    var filetext = var_reports_download_today;

                    $(".intro2").prev('#labeldownloadxl').click(function() {
                        /* original data */
                        
                        var data = JSON.parse(dataintro);
                        console.dir(data);
                        var ws_name = "SheetJS";

                        var wb = new Workbook(),
                            ws = sheet_from_array_of_arrays(data);

                        /* add worksheet to workbook */
                        wb.SheetNames.push(ws_name);
                        wb.Sheets[ws_name] = ws;
                        var wbout = XLSX.write(wb, {
                            bookType: 'xlsx',
                            bookSST: true,
                            type: 'binary'
                        });
                        saveAs(new Blob([s2ab(wbout)], {
                            type: "application/octet-stream"
                        }), filetext + ".xlsx");
                        $('#labeldownloadxl').addClass("report-disable");
                        $( "#labeldownloadxl" ).off();
                        $( "#labeldownloadxl" ).attr("title",var_reportxcel);
                        $('.checkxcel').removeClass("displaynone-impt");
                    });
                    $(".intro2").prev().prev('#labeldownload').click(function() {
                        recenter = 1;

                        console.log(source);
                        var options = {
                            background: '#fff'
                        };

                        $('.intro4').removeClass("displaynone");

                        /*pdf2.addHTML($('.intro4'), options, function() {
                            console.log("source weekly savings");

                            pdf2.save(filetext + ".pdf");
                            $('.checkintro').addClass("noshow");
                            $('.intro4').addClass("displaynone");
                        });
*/

                specialElementHandlers = {
                    // element with id of "bypass" - jQuery style selector
                    '#bypassme': function(element, renderer) {
                        // true = "handled elsewhere, bypass text extraction"
                        return true;
                    }
                };
                margins = {
                    top: 30,
                    bottom: 30,
                    left: 20,
                    right: 20,
                    width: 622
                };

                pdf2.fromHTML(
                    source, // HTML string or DOM elem ref.
                    margins.left, // x coord
                    margins.top, { // y coord
                        'width': margins.width, // max width of content on PDF
                        'elementHandlers': specialElementHandlers
                    },
                    function(dispose) {
                        // dispose: object with X, Y of the last line add to the PDF 
                        //          this allow the insertion of new lines after html
                        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                            /*var binaryData = [];
                            binaryData.push(pdf.output());
                            var blob = new Blob(binaryData, {type: "application/pdf"});
                            window.open(window.URL.createObjectURL(blob),'_blank');*/
                            ////pdf2.output('dataurlnewwindow');
                        } else {
                            pdf2.save(filetext + ".pdf");
                            $('.checkintro').addClass("noshow");
                            $('.intro4').addClass("displaynone");
                            $('#labeldownload').addClass("report-disable");
                            $( "#labeldownload" ).off();
                            $( "#labeldownload" ).attr("title",var_reportpdf);
                            $('.checkpdf').removeClass("displaynone-impt");
                        }

                    }, margins);
                    });
                } else {
                    console.log("dataintro is empty");
                    $('.intro2').css("margin-right", "0px");
                    $('.intro2').css("margin-left", "0px");
                    $('.intro2').removeClass("intro3");

                    $('.intro2').html("<div class='alert alert-danger-report alertshadow alert-shares font-14'>"+var_fail+"</div>");
                } //end check dataintro

            }

        } else {
            $('.checkintro').removeClass("noshow");
            $('.intro4').addClass("displaynone");
        }
    });

    /* End Toggle Report Buttons and handles 
     ******************************************
     ******************************************
     */


    $(function() {
        $('.slide-out-tip-div').tabSlideOut({
            imgPos: 100,
            tabHandle: '.handle', //class of the element that will be your tab
            pathToTabImage: 'images/bouee5.png', //path to the image for the tab (optionaly can be set using css)
            imageHeight: '50px', //height of tab image
            imageWidth: '50px', //width of tab image    
            tabLocation: 'right', //side of screen where tab lives, top, right, bottom, or left
            speed: 300, //speed of animation
            action: 'click', //options: 'click' or 'hover', action to trigger animation
            topPos: '25% !important', //position from the top
            fixedPosition: true //options: true makes it stick(fixed position) on scroll
        });
    });

/*    if ($('#reportShares').is(':visible')) {
        $('.labelexpandadd').addClass("highlightlabel");
        console.log("report SHARES HIGHLIGHTED");
    }
    if ($('#reportInsuff').is(':visible')) {
        console.log("highlight insuff");
        $('.labelexpandrules').addClass("highlightlabel");
    }
    if ($('#reportOrders').is(':visible')) {
        $('.labelexpandedit').addClass("highlightlabel");
    }
    if ($('#reportMoney').is(':visible')) {
        $('.labelexpand').addClass("highlightlabel");
    }
*/

});


window.onload = function() {
    $('#reportMoney').hide();
    $('#reportShares').hide();
    $('#reportOrders').hide();
    $('#reportInsuff').hide();

    var eSelect = document.getElementById('reportSelect');
    console.debug("selected: " + $('#reportSelect').val());

    if (eSelect.selectedIndex === 1 || $('#reportSelect').val() == 'reportMoney') {
        console.log("resultsMoney inside");
        $('.containerreport').hide();
        $('#reportMoney').show();
        $('#reportShares').hide();
        $('#reportOrders').hide();
        $('#reportInsuff').hide();
        $(".reportlabels").addClass("reportlabels2");
        $(window).scrollTop($('#reportMoney').offset().top - 100).scrollLeft($('#reportMoney').offset().left);
    } else if (eSelect.selectedIndex === 2 || $('#reportSelect').val() == 'reportOrders') {
        console.log("resultsOrders inside");
        $('.containerreport').hide();
        $('#reportOrders').show();
        $('#reportShares').hide();
        $('#reportMoney').hide();
        $('#reportInsuff').hide();
        $(".reportlabels").addClass("reportlabels2");
        $(window).scrollTop($('#reportOrders').offset().top - 100).scrollLeft($('#reportOrders').offset().left);
    } else if (eSelect.selectedIndex === 3 || $('#reportSelect').val() == 'reportShares') {
        console.log("resultsShares inside");
        $('.containerreport').hide();
        $('#reportShares').show();
        $('#reportMoney').hide();
        $('#reportOrders').hide();
        $('#reportInsuff').hide();
        $(".reportlabels").addClass("reportlabels2");
        $(window).scrollTop($('#reportShares').offset().top - 100).scrollLeft($('#reportShares').offset().left);
    } else if (eSelect.selectedIndex === 4 || $('#reportSelect').val() == 'reportInsuff') {
        console.log("resultsInsuff inside");
        $('.containerreport').hide();
        $('#reportInsuff').show();
        $('#reportShares').hide();
        $('#reportOrders').hide();
        $('#reportMoney').hide();
        $(".reportlabels").addClass("reportlabels2");
        $(window).scrollTop($('#reportInsuff').offset().top - 100).scrollLeft($('#reportInsuff').offset().left);
    } else if (eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'reportNone') {
        console.log("result None inside");
        $('.containerreport').show();
        $('#reportInsuff').hide();
        $('#reportShares').hide();
        $('#reportOrders').hide();
        $('#reportMoney').hide();
    }

    eSelect.onchange = function() {
        if (eSelect.selectedIndex === 1 || $('#reportSelect').val() == 'reportMoney') {
            console.log("resultsMoney inside0");
            $('.containerreport').hide();
            $('#reportMoney').show();
            $('#reportShares').hide();
            $('#reportOrders').hide();
            $('#reportInsuff').hide();
        } else if (eSelect.selectedIndex === 2 || $('#reportSelect').val() == 'reportOrders') {
            console.log("resultsOrders inside0");
            $('.containerreport').hide();
            $('#reportOrders').show();
            $('#reportShares').hide();
            $('#reportMoney').hide();
            $('#reportInsuff').hide();
        } else if (eSelect.selectedIndex === 3 || $('#reportSelect').val() == 'reportShares') {
            console.log("resultsShares inside0");
            $('.containerreport').hide();
            $('#reportShares').show();
            $('#reportMoney').hide();
            $('#reportOrders').hide();
            $('#reportInsuff').hide();
        } else if (eSelect.selectedIndex === 4 || $('#reportSelect').val() == 'reportInsuff') {
            console.log("resultsInsuff inside0");
            $('.containerreport').hide();
            $('#reportInsuff').show();
            $('#reportShares').hide();
            $('#reportOrders').hide();
            $('#reportMoney').hide();
        } else if (eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'reportNone') {
            console.log("result None inside0");
            $('.containerreport').show();
            $('#reportInsuff').hide();
            $('#reportShares').hide();
            $('#reportOrders').hide();
            $('#reportMoney').hide();
        }
    }


    var checkedstrMoney = "#{checkedstrMoney}";
    if (checkedstrMoney == "true") {
        console.log("section checkedstrMoney");
        $('.containerreport').hide();
        $('#reportShares').hide();
        $('#reportMoney').show();
        $('#reportOrders').hide();
        $('#reportInsuff').hide();
        $(window).scrollTop($('#reportMoney').offset().top - 100).scrollLeft($('#reportMoney').offset().left);
    }
    var checkedstrOrders = "#{checkedstrOrders}";
    if (checkedstrOrders == "true") {
        console.log("section checkedstrOrders");
        $('.containerreport').hide();
        $('#reportShares').hide();
        $('#reportMoney').hide();
        $('#reportOrders').show();
        $('#reportInsuff').hide();
        $(window).scrollTop($('#reportOrders').offset().top - 100).scrollLeft($('#reportOrders').offset().left);
    }
    var checkedstrShares = "#{checkedstrShares}";
    if (checkedstrShares == "true") {
        console.log("section checkedstrShares");
        $('.containerreport').hide();
        $('#reportShares').show();
        $('#reportMoney').hide();
        $('#reportOrders').hide();
        $('#reportInsuff').hide();
        $(window).scrollTop($('#reportShares').offset().top - 100).scrollLeft($('#reportShares').offset().left);
    }
    var checkedstrInsuff = "#{checkedstrInsuff}";
    if (checkedstrInsuff == "true") {
        console.log("section checkedstrInsuff");
        $('.containerreport').hide();
        $('#reportShares').hide();
        $('#reportMoney').hide();
        $('#reportOrders').hide();
        $('#reportInsuff').show();
        $(window).scrollTop($('#reportInsuff').offset().top - 100).scrollLeft($('#reportInsuff').offset().left);
    }

        //if (addMessageMoney != null)
    if ($('.alert').is(':visible')) {
        recenter = 1;

        $(".reportlabels").addClass("reportlabels2");
        if ($(window).width() > 900) {
            $(".labelexpandmood").css("top", "0px");
        }
    }
    if ($('.alert-shares').is(':visible')) {
        $('.labelexpand').addClass("highlightlabel");
    }
    if ($('.alert-orders').is(':visible')) {
        console.log("highlight orders");
        $('.labelexpandedit').addClass("highlightlabel");
    }
    if ($('.alert-insuff').is(':visible')) {
        $('.labelexpandrules').addClass("highlightlabel");
    }
    if ($('.alert-inv').is(':visible')) {
        $('.labelexpandadd').addClass("highlightlabel");
    }


    $(".restrictreport").removeClass("displaynone");

};