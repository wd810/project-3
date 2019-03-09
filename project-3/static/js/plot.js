var svgWidth = 0.8 * window.innerWidth;
var svgHeight = 0.7 * window.innerHeight;
var margin = {
    top: 10,
    right: 50,
    bottom: 30,
    left: 50
};
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
// Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
var barSpacing = 10; // 10x scale on rect height
// create a 'radius' variable for scatter chart plot.
var radius = 10;

$(document).ready(function() {
    d3.select(window).on("resize", handleResize);
    numberGraph();
});
// make svg graph resposive
function handleResize() {
    var svgArea = d3.select("svg");
    // If there is already an svg container on the page, remove it and reload the chart
    if (!svgArea.empty()) {
        svgArea.remove();
        numberGraph()
    }
}
// plot number graph
function numberGraph() {
    d3.json('/data/TypeAvg', function(error, data) {
        if (error) {
            console.warn(error);
        }
        data.forEach(function(data) {
            data.number = +data.number;
            data.height = +data.height;
            data.weight = +data.weight;
            data.dens = +data.dens;
            data.experience = +data.experience;
        });
        //create number bar graph
        chartGroup = initialSvg('#svg_number');
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
    d3.json('/data/TypeAvg', function(error, data) {
        if (error) {
            console.warn(error);
        }
        data.forEach(function(d) {
            d.height = +d.height;
            d.weight = +d.weight;
        });
        chartGroup = initialSvg('#svg_shape');
        yScale = initYScale(data.map(d => d.weight), chartGroup);
        // add xScale to graph
        xScale = initXScaleScattter(data.map(d => d.height), chartGroup);
        // add legend
        var colorValue = d => d.type;
        var colorScale = d3.scaleOrdinal()
            .range(d3.schemeCategory20b);
        var toolTip = d3.tip()
            .attr('class', 'tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<h5>type: " + d.type + "</h5><h5>height: " + d.height + "</h5><h5>weight: " + d.weight + "</h5>";
            });
        var circle = chartGroup.append('g').selectAll("cirlce")
            .data(data)
            .enter()
            .append("circle")
            .classed('circle', true)
            .attr("cx", d => xScale(d.height))
            .attr("cy", d => yScale(d.weight))
            .attr("r", radius)
            .on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);
        chartGroup.call(toolTip);
    });
    // pokemon dens END !
    d3.json('/data/EvlTwoInPerCentent', function(error, data) {
        if (error) { console.warn(error); }
        data.forEach(function(d) {
            d.height = +d.height;
            d.weight = +d.weight;
            d.experience = +d.experience;
        });
        chartGroup = initialSvg('#evol-2');
        yScale = initYScale(data.map(d => d.weight), chartGroup);
        xScale = initXScaleBarChart(data.map(d => d.chain), chartGroup);
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
    });
    // pokemon evl with 2 stages
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
    d3.json('/data/EvolveTwoStage', function(error, data) {
        if (error) { console.warn(error); }
        data.forEach(function(d) {
            d.evl_id = +d.evl_id;
            d.stage_change = +d.stage_change;
            d.weight_change = +d.weight_change;
        });
        height_change = data.map(d => d.stage_change);

        chartGroup = initialSvg('#evolution-two');
        yScale = initYScale(data.map(d => d.weight_change), chartGroup);
        xScale = initXScaleScattter(data.map(d => d.stage_change), chartGroup);
        var toolTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([60, 60])
            .html(function(d) {
                var chain = d.chain;
                console.log(chain.substring(1, -1));
                return (`Evolution Chain: ${d.chain}`);
            });
        // height change 2 stages circle 
        var circle_2stg = chartGroup.append('g').selectAll("cirlce")
            .data(data)
            .enter()
            .append("circle")
            .classed('circle', true)
            .attr('fill-opacity', 0.8)
            .attr("cx", d => xScale(d.stage_change))
            .attr("cy", d => yScale(d.weight_change))
            .attr("r", radius)
            .on('mouseover', function(data) {
                toolTip.show(data, this);
            }).on('mouseout', function() {
                toolTip.hide();
            });
        circle_2stg.call(toolTip);

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
            // height change 2 stages circle 
            var circle_3stg = chartGroup.append('g').selectAll("cirlce")
                .data(data)
                .enter()
                .append("circle")
                .classed('circle-3stg', true)
                .attr('fill-opacity', 0.8)
                .attr("cx", d => xScale(d.height_change))
                .attr("cy", d => yScale(d.weight_change))
                .attr("r", radius)
                .on('mouseover', function(data) {
                    toolTip.show(data, this);
                }).on('mouseout', function() {
                    toolTip.hide();
                });
            circle_2stg.call(toolTip);
        });
        // pokemon evolution with 3 stage END
    });
    //pokemon evolution with 2 stages END
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
}
// graph initialize
function initialSvg(id) {
    //create number bar graph
    var graph = d3.select(id);

    var svg = graph.append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight);
    return chartGroup;
}
// yScale ** suitable for bar chart
function initYScale(y, chartGroup) {
    // add y axis
    var yLabel = y
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(yLabel) * 1.1])
        .range([chartHeight, 0]).nice();

    chartGroup.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));
    return yScale;
}

function updateYScale(label) {
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(label) * 1.1])
        .range([chartHeight, 0]);
    return yScale;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
}
// init xScale band ***suitbale for bar chart
function initXScaleBarChart(x, chartGroup) {
    var xLabel = x;
    var xScale = d3.scaleBand()
        .range([0, chartWidth])
        .domain(xLabel)
        .padding(0.2);
    chartGroup.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));
    return xScale;
}

function updateXScaleTick(label) {
    var xScale = d3.scaleBand()
        .range([0, chartWidth])
        .domain(label)
        .padding(0.2)
    return xScale;
}

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
}
// init xScale band ***suitbale for scatter chart
function initXScaleScattter(x, chartGroup) {
    var xLabel = x;
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(xLabel) * 1.1])
        .range([0, chartWidth]);
    chartGroup.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));
    return xScale;
}