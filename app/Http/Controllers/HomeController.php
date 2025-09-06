<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Response;

class HomeController extends Controller
{
    public function index()
    {
        $htmlPath = public_path('html/country_state_city_crud.html');
        
        if (File::exists($htmlPath)) {
            return new Response(File::get($htmlPath), 200, [
                'Content-Type' => 'text/html',
            ]);
        }
        
        return response('CRUD interface not found. Please check if the HTML file exists.', 404);
    }
}