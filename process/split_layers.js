var fs = require('fs');

var args = process.argv.slice(2);

if (!args.length) {
    console.log("Usage: node split_layers.js filename.geojson filename.min.geojson");
    process.exit(20);
}
var in_file = args[0];
var out_file = args[1];

var layers = {
    "my-buildings": function (feature) {return feature.properties['abandoned:building'] == 'yes'},
    "construction": function(feature) {return feature.properties['abandoned:building'] == 'construction' || feature.properties['abandoned:landuse'] == 'construction'},
    "other": function(feature) {return feature.id == 'way/133159851' || feature.id == 'way/52812820'}
};

var features = JSON.parse(fs.readFileSync(in_file)).features;

var root = {};
Object.keys(layers).forEach(function(layer){
    var filter = layers[layer];
    
    root[layer] = {type: "FeatureCollection"};
    root[layer].features = features.filter(filter);
});

fs.writeFileSync(out_file,JSON.stringify(root, null, 4));