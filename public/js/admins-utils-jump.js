$(document).ready(function() {

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