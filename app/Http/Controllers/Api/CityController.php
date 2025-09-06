<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller {
    public function index() {
        return City::with(['country','state'])->orderBy('name')->get()->map(function($c){
            return [
                'id'=>$c->id,
                'name'=>$c->name,
                'country_id'=>$c->country_id,
                'state_id'=>$c->state_id,
                'country_name'=>$c->country->name ?? null,
                'state_name'=>$c->state->name ?? null,
            ];
        });
    }

    public function store(Request $r) {
        $data = $r->validate([
            'name'=>'required|string|max:191',
            'country_id'=>'required|exists:countries,id',
            'state_id'=>'required|exists:states,id',
        ]);
        $city = City::create($data);
        return response()->json($city, 201);
    }

    public function update(Request $r, City $city) {
        $data = $r->validate([
            'name'=>'required|string|max:191',
            'country_id'=>'required|exists:countries,id',
            'state_id'=>'required|exists:states,id',
        ]);
        $city->update($data);
        return response()->json($city);
    }

    public function destroy(City $city) {
        $city->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
