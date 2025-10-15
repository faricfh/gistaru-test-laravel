<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle ?? 'Peta Interaktif Batam' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <style>
        #leafletMap {
            height: 520px;
        }

        .layer-toggle .btn.active {
            color: #fff;
        }
    </style>
</head>
<body>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 mb-0">{{ $pageTitle ?? 'Peta Interaktif Batam' }}</h1>
            <div class="btn-group" role="group" aria-label="Switch map libraries">
                <a href="{{ route('leaflet') }}" class="btn btn-outline-primary active">Leaflet</a>
                <a href="{{ route('openlayer') }}" class="btn btn-outline-primary">OpenLayers</a>
            </div>
        </div>
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                Peta Perairan Batam
            </div>
            <div class="card-body">
                <p class="text-muted small mb-3">
                    Gunakan tombol di bawah untuk menampilkan atau menyembunyikan lapisan kavling laut dan titik pelabuhan.
                </p>
                <div class="layer-toggle btn-group mb-3" role="group" aria-label="Layer toggle">
                    <button type="button" class="btn btn-outline-primary active" data-layer-target="kavling">
                        Perusahaan
                    </button>
                    <button type="button" class="btn btn-outline-primary active" data-layer-target="pelabuhan">
                        Area Sewa
                    </button>
                </div>
                <div id="leafletMap" class="rounded shadow-sm"></div>
            </div>
        </div>
    </div>
    <script>
        window.leafletConfig = {
            kavlingUrl: "{{ asset('data/titik_perusahaan.geojson') }}",
            pelabuhanUrl: "{{ asset('data/area_sewa.geojson') }}"
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="{{ asset('js/leaflet-init.js') }}"></script>
</body>
</html>
