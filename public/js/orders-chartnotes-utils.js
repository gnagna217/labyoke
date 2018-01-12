            console.log("find0: " + (find0 != null && find0 != undefined && (find0).length > 0));
            window.onload = function() {
                $('#labsComp').hide();
                $('#monthComp').hide();
                $('#qtyComp').hide();

                $('#chartSelect').val('chartQty');

                var eSelect = document.getElementById('chartSelect');
                console.debug("selected: " + $('#chartSelect').val());

                if (chartSelect.selectedIndex === 1 || $('#chartSelect').val() == 'chartQty') {
                    $('#chartNotes').hide();
                    console.log("chartQty inside");
                    $('#qtyComp').show();

                    if (find0 != null && find0 != undefined && (find0).length > 0)
                        document.querySelector('.ct-chart1').__chartist__.update();
                    $('#monthComp').hide();
                    $('#labsComp').hide();
                } else if (chartSelect.selectedIndex === 2 || $('#reportSelect').val() == 'chartOrders') {
                    $('#chartNotes').hide();
                    console.log("chartOrders inside");
                    $('#qtyComp').hide();
                    $('#monthComp').show();
                    if (filteroutput != null && filteroutput != undefined && (filteroutput).length > 0)
                        document.querySelector('.ct-chart0').__chartist__.update();
                    $('#labsComp').hide();
                } else if (chartSelect.selectedIndex === 3 || $('#reportSelect').val() == 'chartLabs') {
                    $('#chartNotes').hide();
                    console.log("chartLabs inside");
                    $('#qtyComp').hide();
                    $('#monthComp').hide();
                    $('#labsComp').show();
                    if (find2 != null && find2 != undefined && (find2).length > 0)
                        document.querySelector('.ct-chart-3').__chartist__.update();
                } else if (eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'chartNone') {
                    console.log("result None inside");
                    $('#qtyComp').hide();
                    $('#monthComp').hide();
                    $('#labsComp').hide();
                    $('#chartNotes').show();
                }

                chartSelect.onchange = function() {
                    if (chartSelect.selectedIndex === 1 || $('#chartSelect').val() == 'chartQty') {
                        console.log("chartQty inside");
                        $('#chartNotes').hide();
                        $('#qtyComp').show();
                        if (find0 != null && find0 != undefined && (find0).length > 0)
                            document.querySelector('.ct-chart1').__chartist__.update();
                        $('#monthComp').hide();
                        $('#labsComp').hide();
                    } else if (chartSelect.selectedIndex === 2 || $('#reportSelect').val() == 'chartOrders') {
                        console.log("chartOrders inside");
                        $('#chartNotes').hide();
                        $('#qtyComp').hide();
                        $('#monthComp').show();
                        if (filteroutput != null && filteroutput != undefined && (filteroutput).length > 0)
                            document.querySelector('.ct-chart0').__chartist__.update();
                        $('#labsComp').hide();
                    } else if (chartSelect.selectedIndex === 3 || $('#reportSelect').val() == 'chartLabs') {
                        console.log("chartLabs inside");
                        $('#chartNotes').hide();
                        $('#qtyComp').hide();
                        $('#monthComp').hide();
                        $('#labsComp').show();
                        if (find2 != null && find2 != undefined && (find2).length > 0)
                            document.querySelector('.ct-chart3').__chartist__.update();
                    } else if (eSelect.selectedIndex === 0 || $('#reportSelect').val() == 'chartNone') {
                        console.log("result None inside");
                        $('#qtyComp').hide();
                        $('#monthComp').hide();
                        $('#labsComp').hide();
                        $('#chartNotes').show();
                    }
                };

            };