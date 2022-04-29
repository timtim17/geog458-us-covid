'use strict';

/* global mapboxgl */

(function() {
    const grades = [50, 100, 500], 
      colors = ['rgb(255,237,160)', 'rgb(254,178,76)', 'rgb(240,59,32)'], 
      radius = [2, 5, 10];
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        center: [-98.5795, 39.8283], // starting position [lng, lat]
        zoom: 4, // starting zoom
        projection: 'albers'
    });

    map.on('load', () => {
        map.addSource('cov19-counts', {
            type: 'geojson',
            data: 'assets/us-covid-2020-counts.geojson'
        });
        map.addLayer({
            'id': 'counts-layer',
            'type': 'circle',
            'source': 'cov19-counts',
            'paint': {
                // increase the radius of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 5,
                            value: grades[0]
                        }, radius[0]],
                        [{
                            zoom: 5,
                            value: grades[1]
                        }, radius[1]],
                        [{
                            zoom: 5,
                            value: grades[2]
                        }, radius[2]]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        });
    });

    map.on('click', 'counts-layer', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`
                <strong>${event.features[0].properties.county}</strong> County in
                <strong>${event.features[0].properties.state}</strong><br>
                <strong>Case Count:</strong> ${event.features[0].properties.cases}
            `)
            .addTo(map);
    });

    const legend = document.getElementById('legend');

    grades.forEach((grade, i) => {
        const vbreak = grade;
        // you need to manually adjust the radius of each dot on the legend 
        // in order to make sure the legend can be properly referred to the dot on the map.
        const color = colors[i];
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
        const dot_radius = 2 * radius[i];

        legend.innerHTML += (
            '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radius +
            'px; height: ' +
            dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
            '</span></p>');
    });
})();
