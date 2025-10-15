/* global L */
(function () {
    const mapElement = document.getElementById('leafletMap');

    if (!mapElement) {
        return;
    }

    const config = window.leafletConfig || {};

    if (!config.kavlingUrl || !config.pelabuhanUrl || !config.jalurPerairanUrl) {
        console.warn('Leaflet map configuration is incomplete.');
        return;
    }

    const map = L.map('leafletMap').setView([1.1, 104.05], 11);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const kavlingLayer = L.geoJSON(null, {
        style: {
            color: '#0d6efd',
            weight: 2,
            fillColor: '#0d6efd',
            fillOpacity: 0.25
        },
        onEachFeature(feature, layer) {
            const nama = feature?.properties?.nama ?? 'Kavling Laut';
            const luas = feature?.properties?.luas ?? '-';
            layer.bindPopup(`<strong>${nama}</strong><br>Luas: ${luas}`);
        }
    });

    const pelabuhanLayer = L.geoJSON(null, {
        pointToLayer(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 7,
                fillColor: '#dc3545',
                color: '#dc3545',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
            });
        },
        onEachFeature(feature, layer) {
            const nama = feature?.properties?.nama ?? 'Pelabuhan';
            const luas = feature?.properties?.luas ?? '-';
            layer.bindPopup(`<strong>${nama}</strong><br>Luas: ${luas}`);
        }
    });

    const jalurPerairanLayer = L.geoJSON(null, {
        style: {
            color: '#198754',
            weight: 4,
            opacity: 0.7
        },
        onEachFeature(feature, layer) {
            const nama = feature?.properties?.nama ?? 'Jalur Perairan';
            const keterangan = feature?.properties?.keterangan ?? '-';
            const panjang = feature?.properties?.luas ?? '-';
            layer.bindPopup(`<strong>${nama}</strong><br>Panjang: ${panjang}<br>${keterangan}`);
        }
    });

    const overlays = {
        'Kavling Laut': kavlingLayer,
        'Pelabuhan Batam': pelabuhanLayer,
        'Jalur Perairan Batam': jalurPerairanLayer
    };

    L.control.layers({ 'OpenStreetMap': osmLayer }, overlays, { collapsed: false }).addTo(map);

    Promise.all([
        fetch(config.kavlingUrl).then((response) => response.json()).then((data) => {
            kavlingLayer.addData(data);
            if (kavlingLayer.getBounds && kavlingLayer.getBounds().isValid()) {
                map.fitBounds(kavlingLayer.getBounds(), { padding: [24, 24] });
            }
        }),
        fetch(config.pelabuhanUrl).then((response) => response.json()).then((data) => {
            pelabuhanLayer.addData(data);
        }),
        fetch(config.jalurPerairanUrl).then((response) => response.json()).then((data) => {
            jalurPerairanLayer.addData(data);
        })
    ]).catch((error) => {
        console.error('Unable to load GeoJSON layers', error);
    });

    const toggleButtons = document.querySelectorAll('[data-layer-target]');

    const layerMap = {
        kavling: kavlingLayer,
        pelabuhan: pelabuhanLayer,
        jalur: jalurPerairanLayer
    };

    toggleButtons.forEach((button) => {
        const target = button.getAttribute('data-layer-target');
        const layer = layerMap[target];
        if (!layer) {
            return;
        }

        button.classList.toggle('active', map.hasLayer(layer));

        button.addEventListener('click', () => {
            const isVisible = map.hasLayer(layer);
            if (isVisible) {
                map.removeLayer(layer);
                button.classList.remove('active');
            } else {
                map.addLayer(layer);
                button.classList.add('active');
            }
        });
    });
})();
