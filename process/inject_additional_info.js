var fs = require('fs');

var args = process.argv.slice(2);

if (!args.length) {
    console.log("Usage: node inject_additional_info.js filename_in.geojson filename_out.geojson");
    process.exit(20);
}

var in_file = args[0];
var out_file = args[1];

var json = JSON.parse(fs.readFileSync(in_file));

// Port Creative Hub
var b1 = json.features.filter(function(f){ return f.id == 'way/52812820'}) [0];
b1.properties.caption = "Port Creative Hub";


// Пивзавод Ріхтера
var b2 = json.features.filter(function(f){ return f.id == 'way/432161564'}) [0];
b2.properties.caption = "Пивзавод Ріхтера";

fs.writeFileSync(out_file, JSON.stringify(json, null, 2));

