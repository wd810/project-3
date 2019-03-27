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