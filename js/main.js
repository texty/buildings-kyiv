/*jslint browser: true*/
/*global Tangram, gui */

map = (function () {
    'use strict';

    var map_start_location = [50.4667, 30.5243, 15.3]; // Kyiv

    /*** URL parsing ***/

    // leaflet-style URL hash pattern:
    // #[zoom],[lat],[lng]
    var url_hash = window.location.hash.slice(1, window.location.hash.length).split('/');

    if (url_hash.length == 3) {
        map_start_location = [url_hash[1],url_hash[2], url_hash[0]];
        // convert from strings
        map_start_location = map_start_location.map(Number);
    }

    /*** Map ***/

    var map = L.map('map', {
        keyboardZoomOffset : .05,
        minZoom: 11,
        maxZoom: 17
    });

    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
        events: {
          click: function(selection) {
              window.selection = selection;

              console.log('Click!', selection);
              if (!selection.feature) return;
              var latlng = selection.leaflet_event.latlng;

              var content = "";

              if (selection.feature.properties['addr:street'])
                  content += '<b>' + selection.feature.properties['addr:street'] + '</b>';

              if (selection.feature.properties['addr:housenumber'])
                  content +=  ', <b>' + selection.feature.properties['addr:housenumber'] + '</b>' + '</br></br>';

              if (selection.feature.properties.note)
                  content += selection.feature.properties.note + '</br></br>';

              if (selection.feature.properties.description)
                  content += selection.feature.properties.description;

              content = content.replace(/<\/br><\/br>$/, '');



              var popup = L.popup().setLatLng(latlng)
                .setContent(content)
                .openOn(map);



          } // interactivity
   }
    });

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    // setView expects format ([lat, long], zoom)
    map.setView(map_start_location.slice(0, 3), map_start_location[2]);

    var hash = new L.Hash(map);

    /***** Render loop *****/

    window.addEventListener('load', function () {
        // Scene initialized
        layer.on('init', function() {});
        layer.addTo(map);

        graphScroll()
            .container(d3.select('#article'))
            .graph(d3.select('#graph'))
            .sections(d3.selectAll('#article p'))
            .on('active', function(i) {
                var section = d3.select('.graph-scroll-active');
                var lon = section.attr('data-lon');
                var lat = section.attr('data-lat');
                if (!lon || !lat) return;

                map.panTo(new L.LatLng(lat, lon));
            });
    });

    return map;

}());

