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
        }

        .sidebar {
            width: 100%;
        }

        @media (min-width: 768px) {
            .sidebar {
                width: 320px;
            }
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
<body class="bg-light">
    <div class="d-flex flex-column flex-md-row min-vh-100">
        <aside class="sidebar bg-white border-bottom border-md-end shadow-sm p-4 d-flex flex-column gap-4">
            <div>
                <h1 class="h4 mb-2">{{ $pageTitle ?? 'Peta Interaktif Batam' }}</h1>
                <p class="mb-0 text-muted">Pilih layer yang ingin ditampilkan.</p>
            </div>

            <section class="d-flex flex-column gap-3" aria-label="Pengaturan layer peta">
                <h2 class="text-uppercase fs-6 fw-semibold text-primary mb-0">Layer Peta</h2>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="layer-titik-perairan" data-layer-target="titikPerairan">
                    <label class="form-check-label fw-semibold" for="layer-titik-perairan">Area Sewa</label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="layer-titik-perusahaan" data-layer-target="titikPerusahaan">
                    <label class="form-check-label fw-semibold" for="layer-titik-perusahaan">Perusahaan</label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="layer-jalur-perairan" data-layer-target="jalurPerairan">
                    <label class="form-check-label fw-semibold" for="layer-jalur-perairan">Jalur Perairan</label>
                </div>
            </section>
        </aside>

        <main class="map-area flex-fill bg-light">
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
