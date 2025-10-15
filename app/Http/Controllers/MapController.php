<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class MapController extends Controller
{
    public function peta(): View
    {
        return view('map.peta', [
            'pageTitle' => 'Peta Interaktif Batam',
        ]);
    }
}
