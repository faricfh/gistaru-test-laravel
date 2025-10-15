<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle ?? 'Peta Interaktif Batam' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v10.6.1/ol.css">
    <style>
        #openlayerMap {
            height: 520px;
        }

        .ol-popup {
            position: absolute;
            background-color: #ffffff;
            box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
            padding: 12px 16px;
            border-radius: 0.5rem;
            border: 1px solid rgba(0, 0, 0, 0.1);
            min-width: 200px;
            transform: translate(-50%, -100%);
        }

        .ol-popup .popup-closer {
            position: absolute;
            top: 8px;
            right: 10px;
            font-size: 1rem;
            text-decoration: none;
            color: #6c757d;
        }

        .ol-popup .popup-closer:hover {
            color: #212529;
        }
    </style>
</head>
<body>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 mb-0">{{ $pageTitle ?? 'Peta Interaktif Batam' }}</h1>
            <div class="btn-group" role="group" aria-label="Switch map libraries">
                <a href="{{ route('leaflet') }}" class="btn btn-outline-primary">Leaflet</a>
                <a href="{{ route('openlayer') }}" class="btn btn-outline-primary active">OpenLayers</a>
            </div>
        </div>
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                Peta Perairan Batam
            </div>
            <div class="card-body">
                <p class="text-muted small mb-3">
                    Klik fitur kavling atau titik pelabuhan untuk melihat informasi nama perusahaan dan luas area.
                </p>
                <div id="openlayerMap" class="rounded shadow-sm position-relative"></div>
                <div id="openlayerPopup" class="ol-popup" role="dialog" aria-live="polite" aria-label="Informasi fitur">
                    <a href="#" class="popup-closer" aria-label="Tutup popup">&times;</a>
                    <div class="popup-content small"></div>
                </div>
            </div>
        </div>
    </div>
    <script>
        window.openlayerConfig = {
            kavlingUrl: "{{ asset('data/titik_perusahaan.geojson') }}",
            pelabuhanUrl: "{{ asset('data/area_sewa.geojson') }}"
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol@v10.6.1/dist/ol.js"></script>
    <script src="{{ asset('js/openlayer-init.js') }}"></script>
</body>
</html>
