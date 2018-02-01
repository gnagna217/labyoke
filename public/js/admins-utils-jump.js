$(document).ready(function() {

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
    /*var pos = var_pos;
    console.log("pos: " + pos);
    if (pos != null && pos != "") {
        $(window).scrollTop($('#rankTblreqshares').offset().top * 10).scrollLeft($('#rankTblreqshares').offset().left);
        var tableid = $('#rankTblreqshares').DataTable();
        console.debug("jumping");
        tableid.page.jumpToData(pos, 0);
    }
    */





    var pos = var_pos;
    console.log("pos: " + pos);
    if (pos != null && pos != "") {
        $(window).scrollTop($('#rankTblreqshares').offset().top * 10).scrollLeft($('#rankTblreqshares').offset().left);
 
        if ( $.fn.dataTable.isDataTable( '#rankTblreqshares' ) ) {
            var tableid = $('#rankTblreqshares').DataTable();
            console.debug("jumping");
            tableid.page.jumpToData(pos, 0);
        }     
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
        if ( $.fn.dataTable.isDataTable( '#rankTblreqshares' ) ) {
            var tableid = $('#rankTblshares').DataTable();
            console.debug("jumping");
            tableid.page.jumpToData(pos2, 0);
        }
    }
});

function radiocatclick() {
    $("#table1").hide();
    $("#table2").show();
    $('input[name=search][value=catalogsearch]').prop('checked', 'checked');
}