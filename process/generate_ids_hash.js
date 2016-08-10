var fs = require('fs');

var args = process.argv.slice(2);

if (!args.length) {
    console.log("Usage: node generate_id_hash.js filename.geojson filename.js");
    process.exit(20);
}

var in_file = args[0];
var out_file = args[1];

var json = JSON.parse(fs.readFileSync(in_file));

var ids = json.buildings.features
    .map(function(feature){ return feature.id.split('/')[1]})
    .reduce(function(o,v,i){ o[v]=1; return o }, {})
    ;

var output = "var __buildings_ids_hash = " + JSON.stringify(ids) + ";";
fs.writeFileSync(out_file,output);

