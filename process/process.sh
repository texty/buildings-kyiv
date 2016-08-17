#!/usr/bin/env bash

nodejs generate_ids_hash.js ../buildings.geojson ../js/buildings_ids_hash.js
#nodejs split_layers.js ../buildings.original.geojson ../buildings.geojson
nodejs inject_additional_info.js ../buildings.geojson ../buildings.changed.geojson
nodejs minify.js ../buildings.changed.geojson ../buildings.min.geojson
