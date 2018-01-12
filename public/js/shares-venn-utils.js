console.log(test);
console.log("filter department venn: " + var_array_labs_venn);
console.log("filter catalog venn: " + var_array_catalogs_venn);
console.log("filter venn: " + test);

$('#vennChart').jvenn({
    series: test,
    colors: colorDefault,
    searchInput: $("#search-field"),
    searchStatus: $("#search-status"),
    searchMinSize: 3,
    fnClickCallback: function() {
        $('#pagination-demo').twbsPagination('destroy');
        var value = "";
        var title = "";
        var list = this.list;
        if (this.listnames.length == 1) {
            title += var_venn_chart_title1 + "<span class='yokeColor'>";
        } else {
            title += var_venn_chart_title2 + "<span class='yokeColor'>";
        }

        for (name in this.listnames) {
            title += this.listnames[name]
            if (name != (this.listnames.length - 1)) {
                title += " | ";
            }
        }
        title = "<b>" + title + "</span></b>";
        title += ":";
        var pageValues = [];
        if (this.list.length == 0) {
            title += var_venn_chart_titlenone + "";
        } else {
            for (val in this.list) {
                pageValues.push(this.list[val]);
                value += "<br/>" + this.list[val];
            }
        }
        value = title + value;
        var total = Math.ceil(this.list.length / 3);
        console.log("total : " + total)
        var displayvalues = "";
        for (val in pageValues) {
            if (val < 3) {
                displayvalues += "<br/>" + pageValues[val];
                console.log("displayvalues : " + displayvalues)
            }
        }
        if (this.list.length > 1) {
            $('#tooltipsvenn').css('min-height', '80px');
        } else {
            $('#tooltipsvenn').css('min-height', '0px');
        }
        if (this.list.length > 3) {
            $('#pagination-demo').twbsPagination({
                totalPages: total,
                visiblePages: 3,
                prev: '<',
                next: '>',
                onPageClick: function(event, page) {
                    var displayvalues2 = "";
                    console.log("page is : " + page)
                    console.log("pageValues is : " + pageValues)
                    if (page == 1) {
                        for (oval in pageValues) {
                            console.log("oval is : " + oval)
                            if (oval <= ((page * 3) - 1)) {
                                displayvalues2 += "<br/>" + pageValues[oval];
                                console.log("displayvalues2 is : " + displayvalues2)
                            }
                        }
                        displayvalues2 = title + displayvalues2;
                    } else {
                        for (oval in pageValues) {
                            console.log("oval is : " + oval)
                            if (oval > (((page - 1) * 3) - 1) && oval <= ((page * 3) - 1)) {
                                displayvalues2 += "<br/>" + pageValues[oval];
                                console.log("displayvalues2 is : " + displayvalues2)
                            }
                        }
                    }
                    $('#tooltipsvenn').html(displayvalues2);
                }
            });
        }

        $("#tooltipsvenn").html(title + displayvalues);
    }
});