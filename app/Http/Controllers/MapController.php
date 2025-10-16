<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class MapController extends Controller
{
    public function peta(): View
    {
        return view('map.peta', [
            'pageTitle' => 'Peta Interaktif Batam',
            'mapConfig' => [
                'titikPerairanUrl' => asset('data/area_sewa.geojson'),
                'titikPerusahaanUrl' => asset('data/titik_perusahaan.geojson'),
                'jalurPerairanUrl' => asset('data/jalur_perairan.geojson'),
            ],
        ]);
    }
}
