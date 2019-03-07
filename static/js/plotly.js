d3.json('/data/EvolveType', function(error, data) {
    if (error) {
        console.warn(error);
    }
    pieData = [{
        values: data.map(d => d.chain),
        labels: ['one stage', 'two stages', 'three stages'],
        type: 'pie'
    }];
    Plotly.newPlot('evolution-type', pieData);
});