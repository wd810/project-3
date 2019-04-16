d3.select(window).on("resize", handleResize);
numberGraph();

// plot number graph
function numberGraph() {
    d3.json('/data/TypeAvg', function(error, data) {
        if (error) {
            console.warn(error);
        }
        var chartGroup = initialSvg('#svg_number');
        // add y axis
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d.number)) * 1.1])
            .range([chartHeight, 0]);
        var yAxis = chartGroup.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale));
        // add x axis
        var xScale = d3.scaleBand()
            .range([0, chartWidth])
            .domain(data.map(d => d.type))
            .padding(0.2);
        var xAxis = chartGroup.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale));
        // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
        var barWidth = (chartWidth - (barSpacing * (data.length + 1))) / data.length;
        // adding tool tip
        var toolTip = d3.tip()
            .attr('class', 'tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<h5>type: " + d.type + "</h5><h5>number: " + d.number + '</h5>';
            });

        barGroup = chartGroup.selectAll()
            .data(data)
            .enter()
            .append('rect')
            .classed("bar", true)
            .attr("x", (d, i) => barSpacing + i * (barWidth + barSpacing))
            .attr("y", d => yScale(d.number))
            .attr("width", d => barWidth)
            .attr("height", d => chartHeight - yScale(d.number))
            .on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);

        barGroup.call(toolTip);
        // add detail description text
        $('.type-disc p').hide();
        $('p#number').show();
        // x label on click 
        $('.btn-group button').on('click', function() {
            $('button').removeClass('active-btn');
            $(this).addClass('active-btn')
            var value = $(this).attr('id');
            var label = data.map(d => d[value]);
            //update y axis
            yScale = updateYScale(label);
            renderYAxis(yScale, yAxis);
            // update x axis
            data.sort((a, b) => b[value] - a[value]);
            xScale = updateXScaleTick(data.map(d => d.type));
            renderXAxis(xScale, xAxis);
            // update bar height
            barGroup.sort(function(a, b) {
                    return d3.descending(a[value], b[value]);
                })
                .transition()
                .delay(function(d, i) {
                    return i * 50; // gives a smoother effect
                })
                .duration(600)
                .attr('x', (d, i) => barSpacing + i * (barWidth + barSpacing))
                .attr("y", d => yScale(d[value]))
                .attr('height', d => chartHeight - yScale(d[value]));
            toolTip.html(function(d) {
                return `<h5>type: ${d.type}</h5><h5>${value}: ${d[value]}'</h5>`;
            });
            // update discription text
            $('.type-disc p').hide(100);
            $(`p#${value}`).show(600);
        });
    });
    // pokemon type END !
    d3.json('/data/Color', function(error, data) {
        if (error) {
            console.warn(error);
        }
        data.forEach(function(data) {
            data.number = +data.number;
        });
        x = data.map(d => d.name);
        y = data.map(d => d.number);
        chartGroup = initialSvg('#svg_color');
        // add yScale to graph
        yScale = initYScale(y, chartGroup);
        // add xScale to graph
        xScale = initXScaleBarChart(x, chartGroup);

        var barWidth = (chartWidth - (barSpacing * (x.length + 1))) / x.length;

        var toolTip = d3.tip()
            .attr('class', 'tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<h5>color: " + d.name + "</h5><h5>number: " + d.number + '</h5>';
            });
        chartGroup.selectAll()
            .data(data)
            .enter()
            .append('rect')
            .classed("bar", true)
            .attr("x", (d, i) => barSpacing + i * (barWidth + barSpacing))
            .attr("y", d => yScale(d.number))
            .attr("width", d => barWidth)
            .attr("height", d => chartHeight - yScale(d.number))
            .on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);
        chartGroup.call(toolTip);
    });
    // pokemon color END !
}