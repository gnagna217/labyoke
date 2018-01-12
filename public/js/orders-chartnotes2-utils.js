            console.log("row: " + var_arraylabRowsStr)

            console.log("val: " + var_arraylabValuesStr)

            var values3 = var_arraylabValuesStr;
            var series = [];
            var rows = [];
            values3 = values3.split("|");

            for (var prop in values3) {
                var valTransform3 = [];
                var i = values3[prop];
                if (i) {
                    valTransform3.push(i);
                    series.push(i);
                }
            }

            var rows4 = var_arraylabRowsStr;
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
                distributeSeries: true
            };
            console.log("series : " + series);
            if (series != null && series.length > 0) {
                var chart3 = new Chartist.Bar('.ct-chart3', data, options);
                var addedEvents3 = false;
                chart3.on('draw', function() {
                    if (!addedEvents3) {
                        $('.ct-chart3').find('.ct-bar').on('mouseover', function() {
                            $('#tooltips3').html((var_dot_selected).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + $(this).attr('ct:value'));
                        });

                        $('.ct-chart3').find('.ct-bar').on('mouseout', function() {
                            $('#tooltips3').html("&nbsp;")
                        });
                    }
                });
            }




            var categories = var_categorieslist;
            categories = categories.split("|");
            var catTransform = [""];
            var catTransformLimit = [];
            var valTransform = [];
            var valTransformOrders = [];
            /*for(var prop in categories){
              catTransform.push((categories[prop]).toLowerCase());
              valTransform.push(0);
              valTransformOrders.push(0);
            }*/

            var rows = var_array_rows;
            rows = rows.split("|");
            var rowTransform = [];

            var rowsOrders = var_array_rows3;
            rowsOrders = rowsOrders.split("|");
            var rowTransformOrders = [];
            var i = 11;
            for (var prop in rowsOrders) {
                if (i > 0) {
                    rowTransformOrders.push(rowsOrders[prop]);
                    console.log("i_1: " + i);

                    catTransform.push((rowsOrders[prop]).toLowerCase());
                    valTransform.push(0);

                    valTransformOrders.push(0);
                    i--;
                }

            }
            console.log("previous catTransform: " + catTransform);

            var c = 0;

            catTransform.pop();
            console.log("catTransform pop: " + catTransform);

            for (var prop in rows) {
                rowTransform.push(rows[prop]);
                console.log("i_2: " + i);
                if (catTransform.indexOf((rows[prop]).toLowerCase()) == -1) {
                    console.log("rows[prop]: " + (rows[prop]).toLowerCase() + ".");
                    if ((rows[prop]).length > 0) {
                        if (i > 0) {
                            catTransform.push((rows[prop]).toLowerCase());
                            valTransform.push(0);

                            valTransformOrders.push(0);
                            i--;
                        }
                    }
                }
            }

            console.log("last catTransform: " + catTransform);

            var values = var_array_values;
            values = values.split("|");

            var count = 0;
            for (var prop in catTransform) {
                //if(count < 11){
                //    count++;
                var cat = (catTransform[prop]).toLowerCase();
                var r = rowTransform[prop];
                catTransformLimit.push(cat);
                console.log("share: " + cat + " - " + r);
                if (r != undefined) {
                    console.log("share0: " + catTransform.indexOf(r.toLowerCase()));
                }
                if (r != undefined && catTransform.indexOf(r.toLowerCase()) != -1) {
                    //valTransform.push(values[prop]);
                    valTransform[catTransform.indexOf(r.toLowerCase())] = values[prop];
                }
                /*else {
                             valTransform.push(0);
                             }*/
                //}
            }



            var valuesorders = var_array_values3;
            valuesorders = valuesorders.split("|");

            count = 0;
            for (var prop in catTransform) {
                // if(count < 11){
                // count++;
                var cat = (catTransform[prop]).toLowerCase();
                var r = rowTransformOrders[prop];
                console.log("order: " + cat + " - " + r);
                if (r != undefined) {
                    console.log("order0: " + catTransform.indexOf(r.toLowerCase()));
                }
                if (r != undefined && catTransform.indexOf(r.toLowerCase()) != -1) {
                    //valTransformOrders.push(valuesorders[prop]);
                    valTransformOrders[catTransform.indexOf(r.toLowerCase())] = valuesorders[prop];
                }
                /*else {
                               valTransformOrders.push(0);
                               }*/
                // }
            }

            console.log("chart orders  valTransformOrders: " + valTransformOrders);
            console.log("chart orders  rowTransformOrders: " + rowTransformOrders);
            console.log("chart shares valTransform: " + valTransform);
            console.log("chart shares rowTransform: " + rowTransform);
            console.log("chart categories: " + categories);

            console.log("more rowTransform trans: " + rowTransform)
            var data = {
                labels: catTransformLimit,
                series: [
                    valTransform, valTransformOrders
                ]
            };
            var values2 = var_array_values2;
            values2 = values2.split("|");
            var valTransform2 = [];
            for (var prop in values2) {
                valTransform2.push(values2[prop]);
            }
            var rows2 = var_array_rows2;
            rows2 = rows2.split("|");
            var rowTransform2 = [];
            for (var prop in rows2) {
                rowTransform2.push(rows2[prop]);
            }
            console.log("more valTransform2 trans: " + valTransform2)
            console.log("more rowTransform2 trans: " + rowTransform2)
            var data2 = {
                labels: rowTransform2,
                series: [
                    valTransform2
                ]
            };
            var responsiveOptions = [
                ['(max-width: 440px)', {
                    width: 300,
                    height: 200
                }],
                ['(max-width: 767px)', {
                    width: 500,
                    height: 200
                }],
                ['(min-width: 990px)', {
                    width: 300,
                    height: 200
                }]
            ];
            console.log("values2 : " + values2);
            if (values2 != null && values2 != "") {
                var chart0 = new Chartist.Bar('.ct-chart0', data2, responsiveOptions);
                var addedEvents0 = false;
                chart0.on('draw', function() {
                    if (!addedEvents0) {
                        $('.ct-chart0').find('.ct-bar').on('mouseover', function() {
                            $('#tooltips0').html((var_dot_selected).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + $(this).attr('ct:value'));
                        });

                        $('.ct-chart0').find('.ct-bar').on('mouseout', function() {
                            $('#tooltips0').html("&nbsp;")
                        });
                    }
                });
            }

            console.log("values : " + values);
            if (values != null && values != "") {
                var chart = new Chartist.Line('.ct-chart1', data, responsiveOptions);
                var addedEvents = false;
                chart.on('draw', function() {
                    if (!addedEvents) {
                        $('.ct-point').on('mouseover', function() {
                            //$('#tooltips').show();
                            var findvalue = $(this).attr('ct:value');
                            var xis = $(this).attr('x2');
                            console.log("xis: " + xis);
                            var roundxis = (Math.floor(xis * 100)) / 100;
                            console.log("roundxis: " + roundxis);
                            var findx = $("foreignObject").filter(function(index) {
                                console.log('inside round: ' + (Math.round($(this).attr("x") * 100)) / 100);
                                console.log('inside floo: ' + (Math.floor($(this).attr("x") * 100)) / 100);
                                return ((Math.round($(this).attr("x") * 100)) / 100) == roundxis || ((Math.round($(this).attr("x") * 100)) / 100) == (roundxis + 10) || ((Math.floor($(this).attr("x") * 100)) / 100) == roundxis || ((Math.floor($(this).attr("x") * 100)) / 100) == (roundxis + 10);
                            });
                            //$("foreignObject[x=roundxis]");
                            console.log("findx: " + findx.attr('x'));
                            var label = findx.find('.ct-label').html();
                            console.log("label: " + label);
                            if (label != undefined && label.length > 0)
                                $('#tooltips').html((var_dot_selected).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + $(this).attr('ct:value') + (var_dot_reagent).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + label);
                        });

                        $('.ct-point').on('mouseout', function() {
                            //$('#tooltips').hide();
                            $('#tooltips').html("&nbsp;")
                        });
                    }
                });
                // Let's put a sequence number aside so we can use it in the event callbacks
                var seq = 0,
                    delays = 50,
                    durations = 300;

                // Once the chart is fully created we reset the sequence
                chart.on('created', function() {
                    seq = 0;
                });

                // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
                chart.on('draw', function(data) {
                    seq++;

                    if (data.type === 'line') {
                        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
                        data.element.animate({
                            opacity: {
                                // The delay when we like to start the animation
                                begin: seq * delays + 1000,
                                // Duration of the animation
                                dur: durations,
                                // The value where the animation should start
                                from: 0,
                                // The value where it should end
                                to: 1
                            }
                        });
                    } else if (data.type === 'label' && data.axis === 'x') {
                        data.element.animate({
                            y: {
                                begin: seq * delays,
                                dur: durations,
                                from: data.y + 100,
                                to: data.y,
                                // We can specify an easing function from Chartist.Svg.Easing
                                easing: 'easeOutQuart'
                            }
                        });
                    } else if (data.type === 'label' && data.axis === 'y') {
                        data.element.animate({
                            x: {
                                begin: seq * delays,
                                dur: durations,
                                from: data.x - 100,
                                to: data.x,
                                easing: 'easeOutQuart'
                            }
                        });
                    } else if (data.type === 'point') {
                        data.element.animate({
                            x1: {
                                begin: seq * delays,
                                dur: durations,
                                from: data.x - 10,
                                to: data.x,
                                easing: 'easeOutQuart'
                            },
                            x2: {
                                begin: seq * delays,
                                dur: durations,
                                from: data.x - 10,
                                to: data.x,
                                easing: 'easeOutQuart'
                            },
                            opacity: {
                                begin: seq * delays,
                                dur: durations,
                                from: 0,
                                to: 1,
                                easing: 'easeOutQuart'
                            }
                        });
                    } else if (data.type === 'grid') {
                        // Using data.axis we get x or y which we can use to construct our animation definition objects
                        var pos1Animation = {
                            begin: seq * delays,
                            dur: durations,
                            from: data[data.axis.units.pos + '1'] - 30,
                            to: data[data.axis.units.pos + '1'],
                            easing: 'easeOutQuart'
                        };

                        var pos2Animation = {
                            begin: seq * delays,
                            dur: durations,
                            from: data[data.axis.units.pos + '2'] - 100,
                            to: data[data.axis.units.pos + '2'],
                            easing: 'easeOutQuart'
                        };

                        var animations = {};
                        animations[data.axis.units.pos + '1'] = pos1Animation;
                        animations[data.axis.units.pos + '2'] = pos2Animation;
                        animations['opacity'] = {
                            begin: seq * delays,
                            dur: durations,
                            from: 0,
                            to: 1,
                            easing: 'easeOutQuart'
                        };

                        data.element.animate(animations);
                    }
                });
            }