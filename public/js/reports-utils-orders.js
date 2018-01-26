var h = $(window).height() - 125;
$(".marginbottom").css("min-height", h);



recenter = 1;
$('.intro2').show();
//$('.pin').show();
//$('.pulse').show();
//$('.pin').show();
//$('.pulse').show();
$('.desktabonly3').show();
var ob = var_resultsOrders;
ob = ob.replace(/&lt;/g, "<");
ob = ob.replace(/&gt;/g, ">");

var pdf = new jsPDF('p', 'pt', 'ledger');
var pdf2 = new jsPDF('p', 'pt', 'ledger');
// source can be HTML-formatted string, or a reference
// to an actual DOM element from which the text will be scraped.
source = ob;

// we support special element handlers. Register them with jQuery-style 
// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
// There is no support for any other type of selectors 
// (class, of compound) at this time.

$(document).ready(function() {

    $(".intro2").show();
    $(".intro2").addClass("backorders");
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

    //$(".reportlabels").addClass("reportlabels2");
    //$('.intro2').css("margin-top",$('.restrictreport').height() + 'px');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("ismobile");
        $('.intro2').css("margin-right", "0px");
        $('.intro2').css("margin-left", "0px");
        $('.threedown').hide();
        console.log("threedown hide");
    } else {
        console.log("isdesktop");
        var dataorders = var_dataOrders;

        if (dataorders != null && dataorders != "") {
            $(".intro2").before("<label for='togglerules' id='labeldownload'  class='labeldownload animated fadeInUp' data-toggle='tooltip' title='" + var_reports_download_pdf + "'><span class='fa fa-download'></span></label><label for='togglerules' id='labeldownloadxl'  class='labeldownload animated fadeInUp labeldownloadxl' data-toggle='tooltip' title='" + var_reports_download_excel + "'><span class='fa fa-database'></span></label>");



            $(".intro2").prev('#labeldownloadxl').click(function() {
                /* original data */
                //var data = [[1,2,3,4],["Sample", "Sample", "Sample", "Sample"],["foo","bar","Hello","0.3"], ["baz", null, "qux"]];
                console.log("" + var_dataOrders);

                var data = JSON.parse(var_dataOrders);
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
                }), var_fileOrders + ".xlsx");
                $('#labeldownloadxl').addClass("report-disable");
                $( "#labeldownloadxl" ).off();
            });


            $(".intro2").prev().prev('#labeldownload').click(function() {
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

                // all coords and widths are in jsPDF instance's declared units
                // 'inches' in this case
                pdf.fromHTML(
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
                            ////pdf.output('dataurlnewwindow');
                        } else {
                            ////pdf.output('dataurlnewwindow');
                        }

                    }, margins);
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
                            pdf2.save(var_fileOrders + ".pdf");
                            $('#labeldownload').addClass("report-disable");
                            $( "#labeldownload" ).off();
                        }

                    }, margins);
            });
        } else {
            $('.intro2').css("margin-right", "0px");
            $('.intro2').css("margin-left", "0px");
        } // end dataorders
    }

});

$(window).scrollTop($('#reportOrders').offset().top).scrollLeft($('#reportOrders').offset().left);