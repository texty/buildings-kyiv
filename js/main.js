/*jslint browser: true*/
/*global Tangram, gui */

var map = (function () {
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
            click: showPopup
        }
    });

    window.layer = layer;

    // setView expects format ([lat, long], zoom)
    map.setView(map_start_location.slice(0, 3), map_start_location[2]);

    var hash = new L.Hash(map);

    /***** Render loop *****/

    window.addEventListener('load', function () {
        // Scene initialized
        // layer.on('init', function() {});
        layer.scene.subscribe({
            load: function (e) {
                // console.log('scene loaded:', e);
                graphScroll()
                    .container(d3.select('#article'))
                    .graph(d3.select('#graph'))
                    .sections(d3.selectAll('#article p.section'))
                    .on('active', function(i) {
                        var section = d3.select('.graph-scroll-active');

                        var data_coords = section.attr('data-coords');
                        if (!data_coords) return;

                        var c = data_coords.split("/");
                        onArticleSelection(c);
                    });
            }
        });

        layer.addTo(map);

        d3.selectAll('#article p.section a')
            .on("click", function(){
                var data_coords = d3.select(this.parentNode).attr('data-coords');
                if (!data_coords) return;

                var c = data_coords.split("/");
                onArticleSelection(c);
            });

        var hammer = new Hammer(document.getElementById('article'));
        hammer.on('swiperight', function(){
            collapser.toggle();
        })
    });
    
    function onArticleSelection(c) {
        var duration = 1; //animation duration, seconds

        map.setView(new L.LatLng(c[0], c[1]), 17, {animate: true, duration: duration});
        var click_latlng = L.latLng(+c[0], +c[1]);
        highLight(click_latlng);

        // dirty brutal hack
        // pan to building, wait an simulate click on it
        setTimeout(function() {
            var pixel = map.latLngToContainerPoint(click_latlng);
            layer.scene
                .getFeatureAt(pixel)
                .then(function(selection) {
                    showPopup(selection, click_latlng);
                });
        }, (duration + .7) * 1000);
    }

    function showPopup(selection, latlng) {
        if (!selection || !selection.feature) return;

        console.log(selection);

        if (!latlng) latlng = selection.leaflet_event.latlng;

        var content = constructPopupHtml(selection.feature.properties);

        L.popup()
            .setLatLng(latlng)
            .setContent(content)
            .openOn(map);

        highLight(latlng);
        // animate_building(selection.feature)
    }

    function highLight(latlng) {
        layer.scene.config.lights.popupLight.position[1] = latlng.lat;
        layer.scene.config.lights.popupLight.position[0] = latlng.lng;
        layer.scene.requestRedraw();
    }

    function animate_building(feature) {
        var id = feature.properties['@id'];
        var layer_name = feature.layers[0];

        layer.scene.config.layers[layer_name].selected.filter = "function() {return feature['@id'] == '" + id +"'}";
        layer.scene.rebuild();
    }

    function constructPopupHtml(properties) {
        var content = "";

        if (properties['addr:street'])
            content += '<b>' + properties['addr:street'] + '</b>';

        if (properties['addr:housenumber'])
            content +=  ', <b>' + properties['addr:housenumber'] + '</b>' + '</br></br>';

        if (properties.note)
            content += properties.note + '</br></br>';

        if (properties.description)
            content += properties.description;

        return content.replace(/<\/br><\/br>$/, '');
    }

    return map;
}());

