$(document).ready(function() {



    $('#rankTblload').DataTable({
        iDisplayLength: 6,
        aLengthMenu: [
            [6, 12, 18, -1],
            [6, 12, 18, "All"]
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

    var h = $(window).height() - 125;
    $(".marginbottom").css("min-height", h);


    $('#rankTblreqshares').DataTable({
        order: [
            [6, "desc"]
        ],
         "columnDefs": [
    { "orderable": false, "targets": 7 },
    { "orderable": false, "targets": 8 },
  ],
        iDisplayLength: 6,
        aLengthMenu: [
            [6, 12, 18, -1],
            [6, 12, 18, "All"]
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
    var pos = var_pos;
    console.log("pos: " + pos);
    if (pos != null && pos != "") {
        $(window).scrollTop($('#rankTblreqshares').offset().top * 10).scrollLeft($('#rankTblreqshares').offset().left);
        var tableid = $('#rankTblreqshares').DataTable();
        console.debug("jumping");
        tableid.page.jumpToData(pos, 0);
    }




    $('#rankTblshares').DataTable({
        order: [
            [1, "asc"]
        ],
        "columnDefs": [
    { "orderable": false, "targets": 6 }
  ],
        iDisplayLength: 6,
        aLengthMenu: [
            [6, 12, 18, -1],
            [6, 12, 18, "All"]
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

    var pos2 = var_pos2;
    console.log("pos2: " + pos2);
    if (pos2 != null && pos2 != "") {
        $(window).scrollTop($('#rankTblshares').offset().top * 10).scrollLeft($('#rankTblshares').offset().left);
        radiocatclick();
        var tableid = $('#rankTblshares').DataTable();
        console.debug("jumping");
        tableid.page.jumpToData(pos2, 0);
    }




    $('.admintop').click(function() {
        if ($('.admintop').hasClass("fadesections")) {
            console.log("remove faded.");
            $('.admintop').removeClass("fadesections");
        }
    });

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


});


var adminTypecheck = var_admintype;
console.log("admintype: " + adminTypecheck);

if (adminTypecheck == "laborders") {
    $("#table1").show();
    $("#table2").hide();
    $('input[name=search][value=keysearch]').prop('checked', 'checked');
} else if (adminTypecheck == "labreagents") {
    $("#table1").hide();
    $("#table2").show();
    $('input[name=search][value=catalogsearch]').prop('checked', 'checked');
} else {
    $("#table1").show();
    $("#table2").hide();
    $('input[name=search][value=keysearch]').prop('checked', 'checked');
}

function radioclick() {
    $("#table1").show();
    $("#table2").hide();
    $('input[name=search][value=keysearch]').prop('checked', 'checked');
}

function radiocatclick() {
    $("#table1").hide();
    $("#table2").show();
    $('input[name=search][value=catalogsearch]').prop('checked', 'checked');
}