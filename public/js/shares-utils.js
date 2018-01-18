$(document).ready(function() {

    $(".sleepimg").click(function() {
        $("#bot").show();
        $(".awake").show();
        $(".sleep").hide();
        $("#popup1bot").show();
        $(".overlaybot").css({
            'visibility': 'visible',
            'opacity': '1'
        });
        setTimeout(function() {
            $('.wc-shellinput').focus();
            $(".wc-shellinput").attr("placeholder", var_bot_placeholder );
        }, 1000);
    });

    $(".close").click(function() {
        $("#bot").hide();
        $(".awake").hide();
        $(".sleep").show();
        $("#popup1bot").hide();
    });

    var h = $(window).height() - 125;
    $(".marginbottom").css("min-height", h);




    var pos = getUrlParameter('pos');
    console.log("pos: " + pos);
    if (pos != null && pos != "") {

        var tableid = $('#rankTblreqshares').DataTable();
        $('#rankTblreqshares').removeClass("animated fadeIn");
        console.debug("jumping");
        tableid.page.jumpToData(pos, 0);
        var tr = $('#rankTblreqshares').find($("tr[data-pos=" + pos + "]"));
        var point = "successful-fulfill";
        console.debug(tr);
        if(tr.hasClass("backColorinsuff")){
            console.log("has point insuff");
            point = "successful-cancel";
        }
        tr.children('td').eq(1).addClass(point);
        //point
        $(window).scrollTop($('#rankTblreqshares').offset().top * 10).scrollLeft($('#rankTblreqshares').offset().left);
    }


    var pos2 = getUrlParameter('pos2');
    console.log("pos2: " + pos2);
    console.log("pos2_: " + (pos2 != null && pos2 != ""));
    if (pos2 != null && pos2 != "") {
        console.log("jumping0");

        console.log("jumping1");
        $('#rankTblshares').removeClass("animated fadeIn");
        console.log("jumping");
        var tableid = $('#rankTblshares').DataTable();
        var tr = $('#rankTblshares').find($("tr[data-pos=" + pos2 + "]"));
        var point = "successful-fulfill";
        console.debug(tr);
        if(tr.hasClass("backColorinsuff")){
            console.log("has point insuff");
            point = "successful-cancel";
        }
        tableid.page.jumpToData(pos2, 0);
        tr.children('td').eq(1).addClass(point);
        //point
        $(window).scrollTop($('#rankTblshares').offset().top * 10).scrollLeft($('#rankTblshares').offset().left);
    }

    $(".uploadtext").addClass("animated fadeIn");
    $('body').click(function() {
        // jQuery selector to get an element
        var query = $('#focusadmin');
        // check if element is Visible
        var isVisible = query.is(':visible');
        if (isVisible === true) {
            console.log("hide admin focus");
            query.hide();
        }
    });
    console.log("share document loaded");
    if ($("#checkdisplay").css("display") == "none") {
        $('.slide-out-tip-div').hide();
    } else {
        $('.slide-out-tip-div').show();
    }
    $('#chartNotes').show();
    $('#sharesVenn').show();
    $('#sharesAll').show();
    $('#monthAll').show();


    $('.slide-out-tip-div').tabSlideOut({
        imgPos: 100,
        tabHandle: '.handle', //class of the element that will be your tab
        pathToTabImage: '/images/bouee5.png', //path to the image for the tab (optionaly can be set using css)
        imageHeight: '50px', //height of tab image
        imageWidth: '50px', //width of tab image    
        tabLocation: 'right', //side of screen where tab lives, top, right, bottom, or left
        speed: 300, //speed of animation
        action: 'click', //options: 'click' or 'hover', action to trigger animation
        topPos: '25% !important', //position from the top
        fixedPosition: true //options: true makes it stick(fixed position) on scroll
    });



if ( !$.fn.dataTable.isDataTable( '#rankTblreqshares' ) ) {
    $('#rankTblreqshares').DataTable({
        order: [
            [5, "desc"]
        ],
        iDisplayLength: 5,
        aLengthMenu: [
            [5, 10, 15, -1],
            [5, 10, 15, "All"]
        ],
        language: {
            processing: var_processing,
            search: var_search,
            lengthMenu: var_lengthMenu,
            info: var_info,
            infoEmpty: var_infoEmpty,
            infoFiltered: var_infoFiltered,
            infoPostFix: "",
            loadingRecords: var_loadingRecords,
            zeroRecords: var_zeroRecords,
            emptyTable: var_emptyTable,
            paginate: {
                first: var_first,
                previous: var_previous,
                next: var_next,
                last: var_last,
                searchPlaceholder: var_searchplaceholder
            },
            aria: {
                sortAscending: var_sortAscending,
                sortDescending: var_sortDescending
            }
        }
    });
}


if ( !$.fn.dataTable.isDataTable( '#rankTblshares' ) ) {
    $('#rankTblshares').DataTable({
        order: [
            [1, "desc"]
        ],
        iDisplayLength: 5,
        aLengthMenu: [
            [5, 10, 15, -1],
            [5, 10, 15, "All"]
        ],
        language: {
            processing: var_processing,
            search: var_search,
            lengthMenu: var_lengthMenu,
            info: var_info,
            infoEmpty: var_infoEmpty,
            infoFiltered: var_infoFiltered,
            infoPostFix: "",
            loadingRecords: var_loadingRecords,
            zeroRecords: var_zeroRecords,
            emptyTable: var_emptyTable,
            paginate: {
                first: var_first,
                previous: var_previous,
                next: var_next,
                last: var_last,
                searchPlaceholder: var_searchplaceholder
            },
            aria: {
                sortAscending: var_sortAscending,
                sortDescending: var_sortDescending
            }
        }
    });
}


});


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


window.onload = function() {
    $('#monthAll').hide();
    $('#sharesAll').hide();

    $('#chartSelect').val('chartVenn');

    var eSelect = document.getElementById('chartSelect');
    console.debug("selected: " + $('#chartSelect').val());

    if (chartSelect.selectedIndex === 1 || $('#chartSelect').val() == 'chartVenn') {
        console.log("sharesVenn inside");
        $('#chartNotes').hide();
        $('#sharesVenn').show();
        $('#monthAll').hide();
        $('#sharesAll').hide();
    }
    if (chartSelect.selectedIndex === 2 || $('#chartSelect').val() == 'chartAll') {
        console.log("sharesAll inside");
        $('#chartNotes').hide();
        $('#sharesAll').show();
        if ("#{find0}" != null && "#{find0}" != undefined && ("#{find0}").length > 0)
            document.querySelector('.ct-chart').__chartist__.update();
        $('#monthAll').hide();
        $('#sharesVenn').hide();
    } else if (chartSelect.selectedIndex === 3 || $('#reportSelect').val() == 'chartMonth') {
        console.log("chartOrders inside");
        $('#chartNotes').hide();
        $('#sharesAll').hide();
        $('#monthAll').show();
        $('#sharesVenn').hide();
        if ("#{filteroutput}" != null && "#{filteroutput}" != undefined && ("#{filteroutput}").length > 0)
            document.querySelector('.ct-chart0').__chartist__.update();
    } else if (eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'chartNone') {
        console.log("result None inside");
        $('#monthAll').hide();
        $('#sharesAll').hide();
        $('#sharesVenn').hide();
        $('#chartNotes').show();
    }

    chartSelect.onchange = function() {
        if (chartSelect.selectedIndex === 1 || $('#chartSelect').val() == 'chartVenn') {
            console.log("sharesAll inside");
            $('#chartNotes').hide();
            $('#sharesAll').hide();
            $('#sharesVenn').show();
            $('#monthAll').hide();
        }
        if (chartSelect.selectedIndex === 2 || $('#chartSelect').val() == 'chartAll') {
            console.log("sharesAll inside");
            $('#chartNotes').hide();
            $('#sharesAll').show();
            $('#sharesVenn').hide();
            if ("#{find0}" != null && "#{find0}" != undefined && ("#{find0}").length > 0)
                document.querySelector('.ct-chart').__chartist__.update();
            $('#monthAll').hide();
        } else if (chartSelect.selectedIndex === 3 || $('#reportSelect').val() == 'chartMonth') {
            console.log("chartOrders inside");
            $('#chartNotes').hide();
            $('#sharesAll').hide();
            $('#sharesVenn').hide();
            $('#monthAll').show();
            if ("#{filteroutput}" != null && "#{filteroutput}" != undefined && ("#{filteroutput}").length > 0)
                document.querySelector('.ct-chart0').__chartist__.update();
        } else if (eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'chartNone') {
            console.log("result None inside");
            $('#monthAll').hide();
            $('#sharesAll').hide();
            $('#sharesVenn').hide();
            $('#chartNotes').show();
        }
    };

};