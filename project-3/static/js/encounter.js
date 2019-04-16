d3.select(window).on("resize", handleResize);
numberGraph();

function numberGraph() {
    d3.json('/data/AreaNumMethods', function(error, data) {
        if (error) {
            console.warn(error);
        }
        var pie_radius = Math.min(chartWidth, chartHeight) / 2 - margin.top;
        // bind data to color
        color.domain(data);
        var chartGroup = initialSvg('#method-catch');
        var svg = chartGroup.append('svg')
            .attr('width', chartWidth)
            .attr('height', chartWidth)
            .append('g')
            .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartHeight / 2 + ')');

        var pie = d3.pie()
            .value(function(d) { return d.value.num_method_to_catch; });
        var data_ready = pie(d3.entries(data));
        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(pie_radius);
        var toolTip = d3.tip()
            .attr('class', 'tip')
            .offset([0, 0])
            .html(function(d) {
                return `<h5>Number: ${d.data.value.num_method_to_catch}</h5>
                    <h5>Rate: ${d.data.value.rate}</h5>`;
            });
        var path = svg.selectAll()
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d) { return color(d.data.value.index); })
            .style("opacity", 0.7)
            .on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);
        path.call(toolTip);
        // add text to pie chart
        svg.selectAll()
            .data(data_ready)
            .enter()
            .append('text')
            .text(d => d.data.value.index)
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .attr('class', 'txt-over');
    });
    // method to catch by location area Pie Chart END !!!
    d3.json('/data/CatchRateMethod', function(error, data) {
        // create svg area
        var chartGroup = initialSvg('#rate_catch');
        // initial Y scale
        var yScale = initYScale(data.map(d => d.num_pokemon_encounter), chartGroup);
        // initial X scale
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d.num_method_to_catch))])
            .range([0, chartWidth]);
        chartGroup.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale).ticks(7).tickFormat(d3.format('d')));
        // intial color scale 
        color.domain(data);
        // add line area one 'num_pokemon_encounter'
        var a_encounter = d3.area()
            .x(d => xScale(d.num_method_to_catch))
            .y0(yScale(0))
            .y1(d => yScale(d.num_pokemon_encounter));
        chartGroup.append('path')
            .datum(data)
            .attr("fill", color(d => d.num_pokemon_encounter))
            .attr('opacity', .7)
            .attr("stroke", color(d => d.num_pokemon_encounter))
            .attr("stroke-width", 1.5)
            .attr('d', a_encounter);
        // add line area two 'avg_catch_one_pokemon'
        var a_rate = d3.area()
            .x(d => xScale(d.num_method_to_catch))
            .y0(yScale(0))
            .y1(d => yScale(d.avg_catch_one_pokemon));
        chartGroup.append('path')
            .datum(data)
            .attr('fill', color(d => d.avg_catch_one_pokemon))
            .attr('opacity', .7)
            .attr('stroke', color(d => d.avg_catch_one_pokemon))
            .attr('stroke-width', 1.5)
            .attr('d', a_rate);
        // Draw the legend
        var legend = chartGroup.append('g')
            .attr('class', 'legend');
        legend.append('rect')
            .attr('x', 20)
            .attr('y', 20)
            .attr('width', 20)
            .attr('height', 10)
            .style('fill', color(d => d.avg_catch_one_pokemon));
        legend.append('rect')
            .attr('x', 20)
            .attr('y', 35)
            .attr('width', 20)
            .attr('height', 10)
            .style('fill', color(d => d.num_pokemon_encounter));
        legend.append('text')
            .attr('x', 48)
            .attr('y', 30)
            .text('Avg Percentage of Catch')
            .attr('class', 'txt-over')
            .attr('fill', '#fff');
        legend.append('text')
            .attr('x', 48)
            .attr('y', 45)
            .text('Avg Percentage of Encounter')
            .attr('class', 'txt-over')
            .attr('fill', '#fff');
        // add mouse over tooltip
        var mouse_scale = data.map(d => xScale(d.num_method_to_catch));
        var focus = chartGroup.append('g')
            .attr('class', 'focus')
            .style('display', 'none');
        focus.append('line')
            .attr('class', 'hover-line')
            .attr('y1', 0)
            .attr('y2', chartHeight);
        focus.append('text')
            .attr('class', 'txt-over')
            .attr('id', 'encounter')
            .attr('fill', '#fff')
            .attr('stroke', '#fff');
        focus.append('text')
            .attr('id', 'catch')
            .attr('class', 'txt-over')
            .attr('fill', '#fff')
            .attr('stroke', '#fff');
        var tipBox = chartGroup.on('mousemove', function() {
                var i = d3.bisect(mouse_scale, d3.mouse(this)[0]);
                var mouseScale = xScale.invert(d3.mouse(this)[0]);
                var d1 = data[i];
                var d0 = data[i - 1];
                var d = d1.num_method_to_catch - mouseScale > mouseScale - d0.num_method_to_catch ? d0 : d1;
                if (d) {
                    focus.transition()
                        .duration(40)
                        .style('display', 'block')
                        .attr("transform", "translate(" + xScale(d.num_method_to_catch) + ",0)");
                    focus.selectAll('text#encounter')
                        .attr("transform", "translate(4," + yScale(d.num_pokemon_encounter) + ")")
                        .text(function() { return d.num_pokemon_encounter + '%'; });
                    focus.selectAll('text#catch')
                        .attr("transform", "translate(4," + yScale(d.avg_catch_one_pokemon) + ")")
                        .text(function() { return d.avg_catch_one_pokemon + '%'; });
                }
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
            });
        // add x axis label
        chartGroup.append('text')
            .attr('fill', '#fff')
            .attr('class', 'txt-over txt-label')
            .attr('transform', `translate(${chartWidth / 2},${chartHeight + margin.bottom})`)
            .text('Number of Possible Methods to Catch Pokémon')
    });
    // catch rate VS method Line graph END !!!
}