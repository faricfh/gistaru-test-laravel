<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle ?? 'Peta Interaktif Batam' }}</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    <style>
        :root {
            color-scheme: light;
        }

        html,
        body {
            height: 100%;
            margin: 0;
            font-family: "Segoe UI", Arial, sans-serif;
            background-color: #f8f9fa;
            color: #212529;
        }

        .map-layout {
            height: 100%;
            display: flex;
            flex-direction: row;
        }

        .sidebar {
            width: 320px;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(6px);
            box-shadow: 0 1.25rem 1.75rem rgba(31, 45, 61, 0.1);
            border-right: 1px solid rgba(0, 0, 0, 0.05);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            overflow-y: auto;
        }

        .sidebar-header h1 {
            font-size: 1.5rem;
            margin: 0;
        }

        .sidebar-header p {
            margin: 6px 0 0 0;
            font-size: 0.95rem;
            color: #6c757d;
            line-height: 1.5;
        }

        .layer-controls {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .layer-group-title {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #0d6efd;
            margin: 0;
        }

        .layer-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }

        .layer-item input[type="checkbox"] {
            margin-top: 4px;
            accent-color: #0d6efd;
        }

        .layer-item label {
            cursor: pointer;
        }

        .layer-item label strong {
            display: block;
            font-size: 1rem;
            margin-bottom: 2px;
        }

        .layer-item label span {
            display: block;
            font-size: 0.9rem;
            color: #6c757d;
            line-height: 1.4;
        }

        .map-container {
            flex: 1;
            position: relative;
        }

        #leafletMap {
            position: absolute;
            inset: 0;
        }

        @media (max-width: 768px) {
            .map-layout {
                flex-direction: column;
            }

            .sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                box-shadow: none;
            }

            .map-container {
                flex: none;
                height: calc(100% - 280px);
            }
        }
    </style>
</head>
<body>
    <div class="map-layout">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>{{ $pageTitle ?? 'Peta Interaktif Batam' }}</h1>
                <p>Pilih layer yang ingin ditampilkan untuk menelusuri data perairan dan aktivitas perusahaan di kawasan Batam.</p>
            </div>

            <section class="layer-controls" aria-label="Pengaturan layer peta">
                <h2 class="layer-group-title">Layer Peta</h2>

                <div class="layer-item">
                    <input type="checkbox" id="layer-titik-perairan" data-layer-target="titikPerairan" checked>
                    <label for="layer-titik-perairan">
                        <strong>Titik Perairan</strong>
                        <span>Area perairan yang memiliki izin pemanfaatan.</span>
                    </label>
                </div>

                <div class="layer-item">
                    <input type="checkbox" id="layer-titik-perusahaan" data-layer-target="titikPerusahaan" checked>
                    <label for="layer-titik-perusahaan">
                        <strong>Titik Perusahaan</strong>
                        <span>Lokasi perusahaan dan fasilitas pelabuhan.</span>
                    </label>
                </div>

                <div class="layer-item">
                    <input type="checkbox" id="layer-jalur-perairan" data-layer-target="jalurPerairan" checked>
                    <label for="layer-jalur-perairan">
                        <strong>Jalur Perairan</strong>
                        <span>Rute pelayaran utama di sekitar Batam.</span>
                    </label>
                </div>
            </section>
        </aside>

        <main class="map-container">
            <div id="leafletMap" role="region" aria-label="Peta interaktif wilayah Batam"></div>
        </main>
    </div>

    <script>
        window.leafletConfig = {
            titikPerairanUrl: "{{ asset('data/area_sewa.geojson') }}",
            titikPerusahaanUrl: "{{ asset('data/titik_perusahaan.geojson') }}",
            jalurPerairanUrl: "{{ asset('data/jalur_perairan.geojson') }}"
        };
    </script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="{{ asset('js/leaflet-init.js') }}"></script>
</body>
</html>
