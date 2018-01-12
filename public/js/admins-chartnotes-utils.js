console.log("row: " + var_array_values2)

console.log("val: " + var_array_values3)

var values3 = var_array_values2;
var values4 = var_array_values3;
var series = [];
var seriesinsuff = [];
var seriesnoninsuff = [];
var rows = [];
values3 = values3.split("|");
values4 = values4.split("|");

for (var prop in values3) {
    var valTransform3 = [];
    var i = values3[prop];
    var j = values4[prop];
    if (j) {
        seriesnoninsuff.push(j)
    } else {
        seriesnoninsuff.push(0);
    }
    if (i) {
        valTransform3.push(i);
        seriesinsuff.push(i);
    } else {
        seriesinsuff.push(0);
    }
}
series.push(seriesinsuff);
series.push(seriesnoninsuff);

var rows4 = var_array_rows2;
rows4 = rows4.split("|");
for (var prop in rows4) {
    var i = rows4[prop];
    if (i) {
        rows.push(i);
    }
}

console.log("more rows: " + rows)
console.log("more series: " + series)
var data = {
    labels: rows,
    series: series
};

var options = {
    seriesBarDistance: 10,
    axisX: {
        //offset: 10 
    },
    axisY: {
        //offset: 80,labelInterpolationFnc: function(value) { return value},
        scaleMinSpace: 15
    }
};
//options = {distributeSeries: true};
console.log("series : " + series);
if (series != null && series.length > 0) {
    var chart = new Chartist.Bar('.ct-chart', data, options);
    var addedEvents = false;
    chart.on('draw', function() {
        if (!addedEvents) {
            $('.ct-chart').find('.ct-bar').on('mouseover', function() {
                $('#tooltips').html((var_dot_selected).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + $(this).attr('ct:value'));
            });

            $('.ct-chart').find('.ct-bar').on('mouseout', function() {
                $('#tooltips').html("&nbsp;")
            });
        }
    });
}