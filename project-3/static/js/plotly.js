d3.json('/data/EvolveType', function(error, data) {
    if (error) {
        console.warn(error);
    }
    pieData = [{
        values: data.map(d => d.chain),
        labels: ['cannot evolve', 'one step in evolution chain', 'two steps in evolution chain'],
        type: 'pie'
    }];
    Plotly.newPlot('evolution-type', pieData);
});