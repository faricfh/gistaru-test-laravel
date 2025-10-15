<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class MapController extends Controller
{
    public function leaflet(): View
    {
        return view('map.leaflet', [
            'pageTitle' => 'Peta Interaktif Batam',
        ]);
    }

    public function openlayer(): View
    {
        return view('map.openlayer', [
            'pageTitle' => 'Peta Interaktif Batam',
        ]);
    }
}
