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
            background: linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%);
        }

        .app-shell {
            min-height: 100vh;
        }

        .sidebar {
            width: 100%;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(6px);
            box-shadow: 0 1.25rem 2.5rem rgba(15, 37, 64, 0.08);
            border-right: 1px solid rgba(13, 110, 253, 0.08);
            padding: 1rem;
            gap: 1.25rem;
        }

        @media (min-width: 768px) {
            .sidebar {
                width: 320px;
                padding: 1.5rem;
            }
        }

        .sidebar-header {
            border-bottom: 1px solid rgba(13, 110, 253, 0.12);
            padding-bottom: 0.85rem;
            margin-bottom: 0.85rem;
        }

        .sidebar-header p {
            font-size: 0.95rem;
            margin-bottom: 0;
        }

        .layer-group {
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
        }

        .layer-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 0.95rem;
            border-radius: 10px;
            border: 1px solid rgba(13, 110, 253, 0.1);
            background: linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%);
            transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .layer-item:hover {
            border-color: rgba(13, 110, 253, 0.35);
        }

        .layer-item .layer-label {
            font-size: 1rem;
            font-weight: 600;
            color: #1f2d3d;
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
                <div class="layer-item">
                    <span class="layer-label">Area Sewa</span>
                    <div class="form-check form-switch ms-2">
                        <input class="form-check-input" type="checkbox" id="layer-titik-perairan" data-layer-target="titikPerairan">
                        <label class="visually-hidden" for="layer-titik-perairan">Area Sewa</label>
                    </div>
                </div>

                <div class="layer-item">
                    <span class="layer-label">Perusahaan</span>
                    <div class="form-check form-switch ms-2">
                        <input class="form-check-input" type="checkbox" id="layer-titik-perusahaan" data-layer-target="titikPerusahaan">
                        <label class="visually-hidden" for="layer-titik-perusahaan">Perusahaan</label>
                    </div>
                </div>

                <div class="layer-item">
                    <span class="layer-label">Jalur Perairan</span>
                    <div class="form-check form-switch ms-2">
                        <input class="form-check-input" type="checkbox" id="layer-jalur-perairan" data-layer-target="jalurPerairan">
                        <label class="visually-hidden" for="layer-jalur-perairan">Jalur Perairan</label>
                    </div>
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
