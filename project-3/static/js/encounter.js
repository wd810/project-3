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
        numberGraph();
    }
}
function numberGraph(){
    d3.json('/data/AreaNumMethods', function(error, data){
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
}