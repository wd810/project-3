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

    //add weight line
    var weight = d3.line()
        .x(d => xScale(d.chain))
        .y(d => yScale(d.weight))

    chartGroup.append('path')
        .data([data])
        .attr('d', weight)
        .classed('line blue', true);
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
    //add tooltip
    var bisect = d3.bisector(function(d) { console.log(d.chain); return d.chain }).left;
    var toolTip = d3.tip()
        .attr('class', 'tip')
        .offset([0, 0])
        .html(function(d) {
            return "<h5>type: 333</h5>";
        });

    var tipBox = chartGroup
        .on('mousemove', function() {
            var chain_x = d3.mouse(this)[0];
            var i = bisect(data, chain_x);
            console.log(i);

        })
        .on('mouseout', toolTip.hide);
    tipBox.call(toolTip);
});

function removeTooltip() {
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

function drawTooltip(data) {
    tooltip.html(year)
        .style('display', 'block')
        .style('left', d3.event.pageX + 20)
        .style('top', d3.event.pageY - 20)
        .selectAll()
        .data(data).enter()
        .append('div')
        .style('color', 'red')
        .html(d => d.weight + ': ');
}
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
    xScale = initXScaleBarChart(data.map(d => d.chain), chartGroup);

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
// pokemin evl with 3 stages

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