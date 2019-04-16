var innerWidth = $('.inner').width();
var svgWidth = innerWidth;
var svgHeight = 0.5 * svgWidth;
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
// pie chart radius
var pie_radius = Math.min(chartWidth, chartHeight) / 2 - margin.top;
// create color scale for global use
var color = d3.scaleOrdinal()
    .range(d3.schemeCategory20);

// make svg graph resposive
function handleResize() {
    var svgArea = d3.selectAll('svg')
        // If there is already an svg container on the page, remove it and reload the chart

    if (!svgArea.empty()) {
        svgArea.remove();
        numberGraph()
    }
}
// graph initialize functions
function initialSvg(id) {
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