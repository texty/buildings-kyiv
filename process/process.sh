#!/usr/bin/env bash

nodejs minify.js ../buildings.geojson ../buildings.min.geojson
nodejs generate_ids_hash.js ../buildings.geojson ../js/buildings_ids_hash.js
