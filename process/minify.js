var fs = require('fs');

var args = process.argv.slice(2);

if (!args.length) {
    console.log("Usage: node minify.js filename.geojson filename.min.geojson");
    process.exit(20);
}
var in_file = args[0];
var out_file = args[1];

var json = JSON.parse(fs.readFileSync(in_file));
fs.writeFileSync(out_file,JSON.stringify(json));

