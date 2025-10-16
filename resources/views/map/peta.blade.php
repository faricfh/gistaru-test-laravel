<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle ?? 'Peta Interaktif Batam' }}</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/pages/map/index.jsx'])
</head>
<body class="map-app-body">
    <div
        id="map-root"
        data-title="{{ $pageTitle ?? 'Peta Interaktif Batam' }}"
        data-config='@json($mapConfig)'
    ></div>
</body>
</html>
