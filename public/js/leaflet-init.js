/* global L, bootstrap */
(function () {
    const mapElement = document.getElementById('leafletMap');

    if (!mapElement) {
        return;
    }

    const config = window.leafletConfig || {};

    if (!config.titikPerairanUrl || !config.titikPerusahaanUrl || !config.jalurPerairanUrl) {
        console.warn('Leaflet map configuration is incomplete.');
        return;
    }

    const modalElement = document.getElementById('featureModal');
    const modalTitle = modalElement?.querySelector('.modal-title') || null;
    const modalBody = document.getElementById('featureModalBody');
    const modalInstance = modalElement ? new bootstrap.Modal(modalElement) : null;

    const hideFeatureModal = () => {
        if (!modalInstance) {
            return;
        }

        modalInstance.hide();
    };

    const showFeatureModal = (title, detailEntries = []) => {
        if (!modalInstance || !modalTitle || !modalBody) {
            return;
        }

        modalTitle.textContent = title;
        modalBody.innerHTML = '';

        const filteredEntries = detailEntries.filter((entry) => entry && entry.value);

        if (filteredEntries.length === 0) {
            const placeholder = document.createElement('p');
            placeholder.classList.add('mb-0', 'text-muted');
            placeholder.textContent = 'Detail tidak tersedia.';
            modalBody.append(placeholder);
        } else {
            const detailList = document.createElement('dl');
            detailList.classList.add('row', 'gx-2', 'gy-1', 'mb-0');

            filteredEntries.forEach((entry) => {
                const dt = document.createElement('dt');
                dt.classList.add('col-4', 'fw-semibold', 'text-muted');
                dt.textContent = entry.label;

                const dd = document.createElement('dd');
                dd.classList.add('col-8', 'mb-0');
                dd.textContent = entry.value;

                detailList.append(dt, dd);
            });

            modalBody.append(detailList);
        }

        modalInstance.show();
    };

    const map = L.map(mapElement, {
        preferCanvas: true
    }).setView([1.1, 104.05], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const formatNumber = (value, suffix = '') => {
        if (value === null || value === undefined || Number.isNaN(Number(value))) {
            return '';
        }

        const formatted = Number(value).toLocaleString('id-ID');
        return `${formatted}${suffix}`;
    };

    const titikPerairanLayer = L.geoJSON(null, {
        style: {
            color: '#0d6efd',
            weight: 2,
            fillColor: '#0d6efd',
            fillOpacity: 0.25
        },
        onEachFeature(feature, layer) {
            const properties = feature?.properties || {};
            const nama = properties.nama ?? 'Area Perairan';
            layer.on('click', (event) => {
                event.originalEvent?.preventDefault?.();
                showFeatureModal(nama, [
                    { label: 'Kategori', value: properties.kategori },
                    { label: 'Izin', value: properties.izin },
                    {
                        label: 'Luas',
                        value: properties.luas_m2 ? `${formatNumber(properties.luas_m2, ' m²')}` : ''
                    }
                ]);
            });
        }
    });

    const titikPerusahaanLayer = L.geoJSON(null, {
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
            const properties = feature?.properties || {};
            const nama = properties.nama ?? 'Titik Perusahaan';
            layer.on('click', (event) => {
                event.originalEvent?.preventDefault?.();
                showFeatureModal(nama, [
                    { label: 'Kategori', value: properties.kategori },
                    { label: 'Izin', value: properties.izin },
                    {
                        label: 'Luas Lahan',
                        value: properties.luas_m2 ? `${formatNumber(properties.luas_m2, ' m²')}` : ''
                    }
                ]);
            });
        }
    });

    const jalurPerairanLayer = L.geoJSON(null, {
        style: {
            color: '#198754',
            weight: 4,
            opacity: 0.7
        },
        onEachFeature(feature, layer) {
            const properties = feature?.properties || {};
            const nama = properties.nama ?? 'Jalur Perairan';
            layer.on('click', (event) => {
                event.originalEvent?.preventDefault?.();
                showFeatureModal(nama, [
                    { label: 'Panjang', value: properties.luas || '' },
                    { label: 'Keterangan', value: properties.keterangan || '' }
                ]);
            });
        }
    });

    const layerMap = {
        titikPerairan: titikPerairanLayer,
        titikPerusahaan: titikPerusahaanLayer,
        jalurPerairan: jalurPerairanLayer
    };

    const fitLayer = (layer) => {
        if (!layer || !map.hasLayer(layer) || typeof layer.getBounds !== 'function') {
            return;
        }

        const bounds = layer.getBounds();
        if (bounds && typeof bounds.isValid === 'function' && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [48, 48] });
        }
    };

    const syncLayerWithInput = (input, layer) => {
        if (!layer) {
            return;
        }

        if (input.checked) {
            if (!map.hasLayer(layer)) {
                layer.addTo(map);
            }
            fitLayer(layer);
        } else if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            hideFeatureModal();
        }
    };

    const layerInputs = Array.from(document.querySelectorAll('[data-layer-target]'));

    layerInputs.forEach((input) => {
        const target = input.getAttribute('data-layer-target');
        const layer = layerMap[target];

        if (!layer) {
            return;
        }

        syncLayerWithInput(input, layer);

        input.addEventListener('change', () => {
            syncLayerWithInput(input, layer);
        });
    });

    const loadLayers = [
        fetch(config.titikPerairanUrl)
            .then((response) => response.json())
            .then((data) => {
                titikPerairanLayer.addData(data);
            }),
        fetch(config.titikPerusahaanUrl)
            .then((response) => response.json())
            .then((data) => {
                titikPerusahaanLayer.addData(data);
            }),
        fetch(config.jalurPerairanUrl)
            .then((response) => response.json())
            .then((data) => {
                jalurPerairanLayer.addData(data);
            })
    ];

    Promise.all(loadLayers)
        .then(() => {
            const bounds = L.latLngBounds();

            Object.values(layerMap).forEach((layer) => {
                if (!map.hasLayer(layer)) {
                    return;
                }

                if (layer.getLayers && layer.getLayers().length > 0 && typeof layer.getBounds === 'function') {
                    const layerBounds = layer.getBounds();
                    if (layerBounds && typeof layerBounds.isValid === 'function' && layerBounds.isValid()) {
                        bounds.extend(layerBounds);
                    }
                }
            });

            if (typeof bounds.isValid === 'function' && bounds.isValid()) {
                map.fitBounds(bounds, { padding: [48, 48] });
            }
        })
        .catch((error) => {
            console.error('Unable to load GeoJSON layers', error);
        });
})();
