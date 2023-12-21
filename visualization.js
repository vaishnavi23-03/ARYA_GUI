
var data = new vis.DataSet();
var counter = 0;

var options = {
    width: '100%',
    height: '400px',
    style: 'bar-size', 
    showGrid: true,
    showShadow: false,
    keepAspectRatio: true,
    verticalRatio: 0.5,
    xLabel: 'Latitude',
    yLabel: 'Longitude',
    zLabel: 'Altitude',
};

var container = document.getElementById('visualization');



data.add({
    id: counter++,
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100,
    style: Math.random() * 20 
});
var graph3d = new vis.Graph3d(container, data, options);

setInterval(function() {
    data.add({
        id: counter++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100,
        style: Math.random() * 20 
    });
}, 1000); 

