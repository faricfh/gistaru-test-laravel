/* global ol */
(function () {
    const mapElement = document.getElementById('openlayerMap');

    if (!mapElement) {
        return;
    }

    const config = window.openlayerConfig || {};

    if (!config.kavlingUrl || !config.pelabuhanUrl) {
        console.warn('OpenLayers map configuration is incomplete.');
        return;
    }

    const kavlingSource = new ol.source.Vector({
        url: config.kavlingUrl,
        format: new ol.format.GeoJSON()
    });

    const pelabuhanSource = new ol.source.Vector({
        url: config.pelabuhanUrl,
        format: new ol.format.GeoJSON()
    });

    const kavlingLayer = new ol.layer.Vector({
        source: kavlingSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(13, 110, 253, 0.25)'
            }),
            stroke: new ol.style.Stroke({
                color: '#0d6efd',
                width: 2
            })
        })
    });

    const pelabuhanLayer = new ol.layer.Vector({
        source: pelabuhanSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: '#dc3545' }),
                stroke: new ol.style.Stroke({
                    color: '#dc3545',
                    width: 1
                })
            })
        })
    });

    const map = new ol.Map({
        target: 'openlayerMap',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            kavlingLayer,
            pelabuhanLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([104.05, 1.1]),
            zoom: 11
        })
    });

    const fitToKavling = () => {
        const extent = kavlingSource.getExtent();
        if (extent && extent.every((value) => Number.isFinite(value))) {
            map.getView().fit(extent, { padding: [24, 24, 24, 24], duration: 500 });
        }
    };

    if (kavlingSource.getState() === 'ready') {
        fitToKavling();
    } else {
        kavlingSource.once('change', () => {
            if (kavlingSource.getState() === 'ready') {
                fitToKavling();
            }
        });
    }

    const popupContainer = document.getElementById('openlayerPopup');
    const popupContent = popupContainer?.querySelector('.popup-content') || null;
    const popupCloser = popupContainer?.querySelector('.popup-closer') || null;

    if (!popupContainer || !popupContent || !popupCloser) {
        console.warn('OpenLayers popup container is missing from the DOM.');
        return;
    }

    const overlay = new ol.Overlay({
        element: popupContainer,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    map.addOverlay(overlay);

    popupCloser.addEventListener('click', (event) => {
        event.preventDefault();
        overlay.setPosition(undefined);
        popupCloser.blur();
    });

    map.on('singleclick', (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (candidate) => candidate);

        if (feature) {
            const geometry = feature.getGeometry();
            let coordinate;

            if (geometry.getType() === 'Point') {
                coordinate = geometry.getCoordinates();
            } else {
                coordinate = ol.extent.getCenter(geometry.getExtent());
            }

            const nama = feature.get('nama') || 'Fitur';
            const luas = feature.get('luas') || '-';

            popupContent.innerHTML = `<strong>${nama}</strong><br>Luas: ${luas}`;
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
        }
    });

    map.on('pointermove', (event) => {
        const hit = map.hasFeatureAtPixel(event.pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
})();
