import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';

import MapLayout from './components/MapLayout';
import LayerToggleList from './components/LayerToggleList';
import FeatureModal from './components/FeatureModal';
import { formatNumber } from './utils';

const INITIAL_COORDINATE = [1.1, 104.05];
const INITIAL_ZOOM = 11;

const PADDING = [48, 48];

const LAYER_DEFINITIONS = [
    {
        id: 'titikPerairan',
        label: 'Area Sewa',
        urlKey: 'titikPerairanUrl',
        createLayer(onFeatureSelect) {
            return L.geoJSON(null, {
                style: {
                    color: '#0d6efd',
                    weight: 2,
                    fillColor: '#0d6efd',
                    fillOpacity: 0.25,
                },
                onEachFeature(feature, layer) {
                    const properties = feature?.properties ?? {};
                    const nama = properties.nama ?? 'Area Perairan';
                    layer.on('click', (event) => {
                        event.originalEvent?.preventDefault?.();
                        onFeatureSelect({
                            title: nama,
                            details: [
                                { label: 'Kategori', value: properties.kategori },
                                { label: 'Izin', value: properties.izin },
                                {
                                    label: 'Luas',
                                    value: properties.luas_m2 ? formatNumber(properties.luas_m2, ' m²') : '',
                                },
                            ],
                        });
                    });
                },
            });
        },
    },
    {
        id: 'titikPerusahaan',
        label: 'Perusahaan',
        urlKey: 'titikPerusahaanUrl',
        createLayer(onFeatureSelect) {
            return L.geoJSON(null, {
                pointToLayer(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 7,
                        fillColor: '#dc3545',
                        color: '#dc3545',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.9,
                    });
                },
                onEachFeature(feature, layer) {
                    const properties = feature?.properties ?? {};
                    const nama = properties.nama ?? 'Titik Perusahaan';
                    layer.on('click', (event) => {
                        event.originalEvent?.preventDefault?.();
                        onFeatureSelect({
                            title: nama,
                            details: [
                                { label: 'Kategori', value: properties.kategori },
                                { label: 'Izin', value: properties.izin },
                                {
                                    label: 'Luas Lahan',
                                    value: properties.luas_m2 ? formatNumber(properties.luas_m2, ' m²') : '',
                                },
                            ],
                        });
                    });
                },
            });
        },
    },
    {
        id: 'jalurPerairan',
        label: 'Jalur Perairan',
        urlKey: 'jalurPerairanUrl',
        createLayer(onFeatureSelect) {
            return L.geoJSON(null, {
                style: {
                    color: '#198754',
                    weight: 4,
                    opacity: 0.7,
                },
                onEachFeature(feature, layer) {
                    const properties = feature?.properties ?? {};
                    const nama = properties.nama ?? 'Jalur Perairan';
                    layer.on('click', (event) => {
                        event.originalEvent?.preventDefault?.();
                        onFeatureSelect({
                            title: nama,
                            details: [
                                { label: 'Panjang', value: properties.luas || '' },
                                { label: 'Keterangan', value: properties.keterangan || '' },
                            ],
                        });
                    });
                },
            });
        },
    },
];

function fitMapToLayer(mapInstance, layer) {
    if (!mapInstance || !layer || typeof layer.getBounds !== 'function') {
        return;
    }

    const bounds = layer.getBounds();

    if (bounds && typeof bounds.isValid === 'function' && bounds.isValid()) {
        mapInstance.fitBounds(bounds, { padding: PADDING });
    }
}

function sanitizeDetails(details) {
    return details.filter((entry) => entry && entry.value);
}

/**
 * Halaman peta interaktif yang merender Leaflet melalui React.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {Record<string, string>} props.config
 * @returns {JSX.Element}
 */
export default function MapPage({ title, config }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const layersRef = useRef({});

    const [activeLayers, setActiveLayers] = useState(() =>
        LAYER_DEFINITIONS.reduce((accumulator, layer) => {
            accumulator[layer.id] = false;
            return accumulator;
        }, {}),
    );

    const [layerState, setLayerState] = useState(() =>
        LAYER_DEFINITIONS.reduce((accumulator, layer) => {
            accumulator[layer.id] = { status: 'idle', hasData: false, error: null };
            return accumulator;
        }, {}),
    );

    const [selectedFeature, setSelectedFeature] = useState(null);

    const handleToggleLayer = useCallback((layerId) => {
        setActiveLayers((prev) => ({
            ...prev,
            [layerId]: !prev[layerId],
        }));
    }, []);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) {
            return undefined;
        }

        const mapInstance = L.map(mapContainerRef.current, { preferCanvas: true }).setView(
            INITIAL_COORDINATE,
            INITIAL_ZOOM,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance);

        mapRef.current = mapInstance;

        return () => {
            mapInstance.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const mapInstance = mapRef.current;

        if (!mapInstance) {
            return undefined;
        }

        const layerInstances = {};

        LAYER_DEFINITIONS.forEach((definition) => {
            layerInstances[definition.id] = definition.createLayer((feature) => {
                setSelectedFeature({
                    title: feature.title,
                    details: sanitizeDetails(feature.details),
                });
            });
        });

        layersRef.current = layerInstances;

        return () => {
            Object.values(layerInstances).forEach((layer) => {
                if (mapInstance.hasLayer(layer)) {
                    mapInstance.removeLayer(layer);
                }
                layer.remove();
            });

            layersRef.current = {};
        };
    }, []);

    useEffect(() => {
        const mapInstance = mapRef.current;

        if (!mapInstance) {
            return undefined;
        }

        const abortController = new AbortController();

        LAYER_DEFINITIONS.forEach((definition) => {
            const url = config?.[definition.urlKey];

            if (!url) {
                setLayerState((prev) => ({
                    ...prev,
                    [definition.id]: {
                        status: 'error',
                        hasData: false,
                        error: 'URL layer tidak tersedia.',
                    },
                }));
                return;
            }

            setLayerState((prev) => ({
                ...prev,
                [definition.id]: {
                    ...prev[definition.id],
                    status: 'loading',
                    error: null,
                },
            }));

            fetch(url, { signal: abortController.signal })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Gagal memuat data (${response.status})`);
                    }
                    return response.json();
                })
                .then((data) => {
                    const layer = layersRef.current?.[definition.id];

                    if (!layer) {
                        return;
                    }

                    layer.clearLayers();
                    layer.addData(data);

                    setLayerState((prev) => ({
                        ...prev,
                        [definition.id]: {
                            status: 'ready',
                            hasData: true,
                            error: null,
                        },
                    }));
                })
                .catch((error) => {
                    if (abortController.signal.aborted) {
                        return;
                    }

                    console.error(`Unable to load GeoJSON layer "${definition.id}"`, error);

                    setLayerState((prev) => ({
                        ...prev,
                        [definition.id]: {
                            status: 'error',
                            hasData: false,
                            error: error.message || 'Gagal memuat data.',
                        },
                    }));
                });
        });

        return () => {
            abortController.abort();
        };
    }, [config]);

    useEffect(() => {
        const mapInstance = mapRef.current;

        if (!mapInstance) {
            return;
        }

        LAYER_DEFINITIONS.forEach((definition) => {
            const layer = layersRef.current?.[definition.id];
            const state = layerState[definition.id];

            if (!layer || !state || !state.hasData) {
                if (mapInstance.hasLayer(layer)) {
                    mapInstance.removeLayer(layer);
                }
                return;
            }

            if (activeLayers[definition.id]) {
                if (!mapInstance.hasLayer(layer)) {
                    layer.addTo(mapInstance);
                    fitMapToLayer(mapInstance, layer);
                }
            } else if (mapInstance.hasLayer(layer)) {
                mapInstance.removeLayer(layer);
                setSelectedFeature(null);
            }
        });
    }, [activeLayers, layerState]);

    const sidebarItems = useMemo(
        () =>
            LAYER_DEFINITIONS.map((definition) => {
                const state = layerState[definition.id] || {};
                return {
                    id: definition.id,
                    label: definition.label,
                    checked: Boolean(activeLayers[definition.id]),
                    disabled: state.status === 'loading',
                    status: state.status === 'ready' ? 'idle' : state.status,
                    helperText: state.status === 'ready' ? 'Aktifkan untuk menampilkan layer di peta.' : undefined,
                    error: state.error,
                };
            }),
        [activeLayers, layerState],
    );

    return (
        <>
            <MapLayout
                title={title}
                description="Aktifkan layer untuk melihat data spasial yang relevan."
                sidebar={<LayerToggleList items={sidebarItems} onToggle={handleToggleLayer} />}
                mapContainerRef={mapContainerRef}
            >
                <FeatureModal
                    isOpen={Boolean(selectedFeature)}
                    title={selectedFeature?.title ?? ''}
                    details={selectedFeature?.details ?? []}
                    onClose={() => setSelectedFeature(null)}
                />
            </MapLayout>
        </>
    );
}
