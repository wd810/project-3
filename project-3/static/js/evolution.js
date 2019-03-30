d3.select(window).on("resize", handleResize);
// make svg graph resposive
// make svg graph resposive
function handleResize() {
    var svgArea = d3.select("svg");
    // If there is already an svg container on the page, remove it and reload the chart
    if (!svgArea.empty()) {
        svgArea.remove();
        //numberGraph()
    }
}
d3.json('/data/EvolveType', function(error, data) {
    if (error) {
        console.warn(error);
    }
    var pie_radius = Math.min(chartWidth, chartHeight) / 2 - margin.top;
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeCategory20);
    var chartGroup = initialSvg('#evolution-type');
    var svg = chartGroup.append('svg')
        .attr('width', chartWidth)
        .attr('height', chartWidth)
        .append('g')
        .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartHeight / 2 + ')');

    var pie = d3.pie()
        .value(function(d) { return d.value.chain; });
    var data_ready = pie(d3.entries(data));
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(pie_radius);

    svg.selectAll()
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return color(d.data.value.chain) })
        .style("opacity", 0.7);

    // add text to pie chart
    svg.selectAll()
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d) {
            var text = '';
            var total = 419;
            var per = 0;

            switch (d.data.value.stage) {
                case 1:
                    text = 'No Evolution: ';
                    per = Math.round(d.data.value.chain / total * 100);
                    break;
                case 2:
                    text = 'One Evolution: ';
                    per = Math.round(d.data.value.chain / total * 100);
                    break;
                case 3:
                    text = 'Two Evolution: ';
                    per = Math.round(d.data.value.chain / total * 100);
            }
            var return_txt = text + d.data.value.chain + '(' + per + '%)';
            return return_txt;
        })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .attr('class', 'tip');
});
// pokemon evolution pie chart END !!!
d3.json('/data/EvlTwoInPerCentent', function(error, data) {
    if (error) { console.warn(error); }
    data.forEach(function(d) {
        d.height = +d.height;
        d.weight = +d.weight;
        d.experience = +d.experience;
    });
    // sort data by weight
    data.sort(function(a, b) { return b.weight - a.weight; });
    chartGroup = initialSvg('#evol-2');
    //yScale = initYScale(data.map(d => d.weight), chartGroup);
    var yScale = d3.scaleLinear()
        .domain([-100, d3.max(data.map(d => d.weight)) * 1.05])
        .range([chartHeight, 0]);

    chartGroup.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));
    // add x bottom axis
    var xScale = d3.scaleBand()
        .range([0, chartWidth])
        .domain(data.map(d => d.chain))
        .padding(0.2);

    chartGroup.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(""));

    // add height line
    var height = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.height));

    chartGroup.append('path')
        .data([data])
        .attr('d', height)
        .classed('line green', true);
    //add experience line
    var experience = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.experience));

    chartGroup.append('path')
        .data([data])
        .attr('d', experience)
        .classed('line orange', true);
    //add weight line
    var weight = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.weight))

    chartGroup.append('path')
        .data([data])
        .attr('d', weight)
        .classed('line blue', true);
    //add tooltip
    var focus = chartGroup.append('g')
        .attr('class', 'focus')
        .style('display', 'none');
    focus.append('line')
        .attr('class', 'hover-line')
        .attr('y1', 0)
        .attr('y2', chartHeight);
    focus.append('div');

    var mouse_scale = data.map(d => xScale(d.chain));
    chartGroup.append("rect")
        .attr("transform", "translate(0,0)")
        .attr('class', 'overlay')
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .on('mousemove', function() {
            var mouse_x = d3.mouse(this)[0];
            var i = d3.bisect(mouse_scale, mouse_x);
            //var mouseScale = xScale.invert(mouse_x);
            var d1 = data[i];
            var d0 = data[i - 1];
            var d = d1.chain - i > i - d0.chain ? d0 : d1;
            if (d) {
                focus.style('display', 'block')
                    .attr("transform", "translate(" + xScale(d.chain) + ",0)");
                focus.selectAll('div')
                    .html("<h5>chain: " + d.chain + "</h5><h5>weight: " + d.weight + '</h5>');
            }
        })
        .on("mouseover", function() { focus.style("display", null); })
        .on('mouseout', function() { focus.style('display', 'none'); });

});
// pokemon evl with 2 stages END 
d3.json('/data/EvlThreeInPerCentent', function(error, data) {
    if (error) { console.warn(error); }
    data.forEach(function(d) {
        d.height_1 = +d.height_1;
        d.height_2 = +d.height_2;
        d.weight_1 = +d.weight_1;
        d.weight_2 = +d.weight_2;
        d.experience_1 = +d.experience_1;
        d.experience_2 = +d.experience_2;
    });
    chartGroup = initialSvg('#evol-3');
    yScale = initYScale(data.map(d => d.height_2), chartGroup);
    // add x bottom axis
    var xScale = d3.scaleBand()
        .range([0, chartWidth])
        .domain(data.map(d => d.chain))
        .padding(0.2);

    chartGroup.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(""));

    // add weight 1 line
    var weight_1 = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.weight_1));

    chartGroup.append('path')
        .data([data])
        .attr('d', weight_1)
        .classed('line blue', true);
    var weight_2 = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.weight_2));

    chartGroup.append('path')
        .data([data])
        .attr('d', weight_2)
        .classed('line green', true);
    // add height 1 line
    var height_1 = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.height_1));

    chartGroup.append('path')
        .data([data])
        .attr('d', height_1)
        .classed('line orange', true);
    var height_2 = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.height_2));

    chartGroup.append('path')
        .data([data])
        .attr('d', height_2)
        .classed('line yellow', true);
    // add experience 1 line
    var experience_1 = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.experience_1));

    chartGroup.append('path')
        .data([data])
        .attr('d', experience_1)
        .classed('line red', true);
    var experience_2 = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.experience_2));

    chartGroup.append('path')
        .data([data])
        .attr('d', experience_2)
        .classed('line purple', true);

});
// pokemon evl with 3 stages

d3.json('/data/EvolveThreeStage', function(error, data) {
    if (error) { console.warn(error); }
    data.forEach(function(d) {
        d.evl_id = +d.evl_id;
        d.height_change = +d.height_change;
        d.weight_change = +d.weight_change;
        d.weight_1 = +d.weight_1;
        d.weight_2 = +d.weight_2;
        d.step1 = +d.step1;
        d.step2 = +d.step2;
    });

});
// pokemon evolution with 3 stage END