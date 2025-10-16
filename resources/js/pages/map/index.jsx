import React from 'react';
import { createRoot } from 'react-dom/client';

import 'leaflet/dist/leaflet.css';

import MapPage from './MapPage';

const rootElement = document.getElementById('map-root');

if (rootElement) {
    let config = {};

    if (rootElement.dataset.config) {
        try {
            config = JSON.parse(rootElement.dataset.config);
        } catch (error) {
            console.warn('Konfigurasi peta tidak valid. Menggunakan konfigurasi kosong.', error);
        }
    }

    const root = createRoot(rootElement);
    root.render(<MapPage config={config} />);
}
