<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller {
    public function index() {
        return Country::orderBy('name')->get();
    }

    public function store(Request $r) {
        $data = $r->validate(['name'=>'required|string|max:191|unique:countries,name']);
        $country = Country::create($data);
        return response()->json($country, 201);
    }

    public function show(Country $country) {
        return $country;
    }

    public function update(Request $r, Country $country) {
        $data = $r->validate(['name'=>'required|string|max:191|unique:countries,name,' . $country->id]);
        $country->update($data);
        return response()->json($country);
    }

    public function destroy(Country $country) {
        $country->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
