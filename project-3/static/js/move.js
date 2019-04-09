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

function numberGraph() {
    d3.json('/data/MoveDamageClass', function(error, data) {
        if (error) {
            console.warn(error);
        }
        // bind data to color
        color.domain(data);
        var chartGroup = initialSvg('#damage-class');
        var svg = chartGroup.append('svg')
            .attr('width', chartWidth)
            .attr('height', chartWidth)
            .append('g')
            .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartHeight / 2 + ')');

        var pie = d3.pie()
            .value(function(d) { return d.value.count; });
        var data_ready = pie(d3.entries(data));
        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(pie_radius);
        var path = svg.selectAll()
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d) { return color(d.data.value.accuracy); })
            .style("opacity", 0.7);
        // add text to pie chart
        svg.selectAll()
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d) {
                return d.data.value.damage_class;
            })
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .attr('class', 'txt-over');
    });
    // damage class pie chart END !!!
    d3.json('/data/MoveCategory', function(error, data){
        var chartGroup = initialSvg('#category');
        var svg = chartGroup.append('svg')
            .attr('width', chartWidth)
            .attr('height', chartWidth)
            .append('g')
            .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartHeight / 2 + ')');

        var pie = d3.pie()
            .value(function(d) { return d.value.count; });
        var data_ready = pie(d3.entries(data));
        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(pie_radius);
        var path = svg.selectAll()
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d) { return color(d.data.value.per); })
            .style("opacity", 0.7);
        // add text to pie chart
        svg.selectAll()
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d) {
                return d.data.value.category;
            })
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .attr('class', 'txt-over');
    });
    // category pie chart END !!!
}