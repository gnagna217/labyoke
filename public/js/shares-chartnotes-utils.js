


					console.log("filter: " + var_filteroutput);
					var values = var_array_values;
					values = values.split("|");
					var valTransform = [];
					for(var prop in values){
						valTransform.push(values[prop]);
					}
					var rows = var_array_rows;
					rows = rows.split("|");
					var rowTransform = [];
					for(var prop in rows){
						rowTransform.push(rows[prop]);
					}
					console.log("more rowTransform trans: " + rowTransform)
					var data = {
						labels: rowTransform,
						series: [
							valTransform
						]
					};

					var values2 = var_array_values2;
					values2 = values2.split("|");
					var valTransform2 = [];
					for(var prop in values2){
						valTransform2.push(values2[prop]);
					}
					var rows2 = var_array_rows2;
					rows2 = rows2.split("|");
					var rowTransform2 = [];
					for(var prop in rows2){
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
					/*
					var options = {
						width: 300,
						height: 200
					};*/

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


					if(values != null && values != ""){
					var chart = new Chartist.Line('.ct-chart', data, responsiveOptions);

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

						if(data.type === 'line') {
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
						} else if(data.type === 'label' && data.axis === 'x') {
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
						} else if(data.type === 'label' && data.axis === 'y') {
							data.element.animate({
								x: {
									begin: seq * delays,
									dur: durations,
									from: data.x - 100,
									to: data.x,
									easing: 'easeOutQuart'
								}
							});
						} else if(data.type === 'point') {
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
						} else if(data.type === 'grid') {
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

					// For the sake of the example we update the chart every time it's created with a delay of 10 seconds
					/*chart.on('created', function() {
						if(window.__exampleAnimateTimeout) {
							clearTimeout(window.__exampleAnimateTimeout);
							window.__exampleAnimateTimeout = null;
						}
						window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
					});*/

					
					var addedEvents = false;
					chart.on('draw', function() {
						if (!addedEvents) {
							$('.ct-point').on('mouseover', function() {
								$('#tooltips').html((var_dot_select).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + $(this).attr('ct:value'));
							});

							$('.ct-point').on('mouseout', function() {
								$('#tooltips').html("&nbsp;")
							});
						}
					});
					}

					if(values2 != null && values2 != ""){
						var chart0 = new Chartist.Bar('.ct-chart0', data2, responsiveOptions);
						var addedEvents0 = false;
						chart0.on('draw', function() {
							if (!addedEvents0) {
								$('.ct-bar').on('mouseover', function() {
									$('#tooltips0').html((var_dot_select).replace(/&lt;/g, '<').replace(/&gt;/g, '>')  + $(this).attr('ct:value'));
								});

								$('.ct-bar').on('mouseout', function() {
									$('#tooltips0').html("&nbsp;")
								});
							}
						});
					}
