<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle ?? 'Peta Interaktif Batam' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    <style>
        html,
        body {
            height: 100%;
        }

        body {
            margin: 0;
            background: #f8f9fb;
            color: #212529;
        }

        .app-shell {
            min-height: 100vh;
        }

        .sidebar {
            width: 100%;
            background: #ffffff;
            border-right: 1px solid #e5e7eb;
            padding: 1.25rem;
        }

        @media (min-width: 768px) {
            .sidebar {
                width: 280px;
                padding: 1.5rem;
            }
        }

        .sidebar-header {
            margin-bottom: 1rem;
        }

        .sidebar-header p {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0;
        }

        .layer-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .layer-item {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.35rem 0;
            border-bottom: 1px solid #f1f3f5;
            padding-left: 0;
        }

        .layer-item:last-child {
            border-bottom: none;
        }

        .layer-item .form-check-input {
            width: 1rem;
            height: 1rem;
            margin: 0;
            float: none;
        }

        .layer-item .form-check-label {
            font-size: 0.95rem;
            margin: 0;
        }

        .map-area {
            position: relative;
            min-height: 60vh;
        }

        @media (min-width: 768px) {
            .map-area {
                min-height: 100vh;
            }
        }

        #leafletMap {
            position: absolute;
            inset: 0;
        }
    </style>
</head>
<body>
    <div class="app-shell d-flex flex-column flex-md-row">
        <aside class="sidebar d-flex flex-column align-items-stretch">
            <div class="sidebar-header">
                <h1 class="h4 mb-2">{{ $pageTitle ?? 'Peta Interaktif Batam' }}</h1>
                <p class="text-muted mb-0">Aktifkan layer yang ingin ditampilkan.</p>
            </div>

            <section aria-label="Pengaturan layer peta" class="layer-group">
                <div class="form-check layer-item">
                    <input class="form-check-input" type="checkbox" id="layer-titik-perairan" data-layer-target="titikPerairan">
                    <label class="form-check-label" for="layer-titik-perairan">Area Sewa</label>
                </div>

                <div class="form-check layer-item">
                    <input class="form-check-input" type="checkbox" id="layer-titik-perusahaan" data-layer-target="titikPerusahaan">
                    <label class="form-check-label" for="layer-titik-perusahaan">Perusahaan</label>
                </div>

                <div class="form-check layer-item">
                    <input class="form-check-input" type="checkbox" id="layer-jalur-perairan" data-layer-target="jalurPerairan">
                    <label class="form-check-label" for="layer-jalur-perairan">Jalur Perairan</label>
                </div>
            </section>
        </aside>

        <main class="map-area flex-fill">
            <div id="leafletMap" role="region" aria-label="Peta interaktif wilayah Batam"></div>
        </main>
    </div>

    <div class="modal fade" id="featureModal" tabindex="-1" aria-labelledby="featureModalTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title h5 mb-0" id="featureModalTitle">Detail Fitur</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <div class="modal-body" id="featureModalBody"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.leafletConfig = {
            titikPerairanUrl: "{{ asset('data/area_sewa.geojson') }}",
            titikPerusahaanUrl: "{{ asset('data/titik_perusahaan.geojson') }}",
            jalurPerairanUrl: "{{ asset('data/jalur_perairan.geojson') }}"
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="{{ asset('js/leaflet-init.js') }}"></script>
</body>
</html>
