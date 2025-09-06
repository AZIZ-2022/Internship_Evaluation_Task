<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller {
    public function index(Request $r) {
        $q = State::query()->with('country');
        if ($r->filled('country_id')) $q->where('country_id', $r->get('country_id'));
        return $q->orderBy('name')->get()->map(function($s){
            return [
                'id'=>$s->id,
                'name'=>$s->name,
                'country_id'=>$s->country_id,
                'country_name'=>$s->country->name ?? null,
            ];
        });
    }

    public function store(Request $r) {
        $data = $r->validate([
            'name'=>'required|string|max:191',
            'country_id'=>'required|exists:countries,id'
        ]);
        $state = State::create($data);
        return response()->json($state, 201);
    }

    public function update(Request $r, State $state) {
        $data = $r->validate([
            'name'=>'required|string|max:191',
            'country_id'=>'required|exists:countries,id'
        ]);
        $state->update($data);
        return response()->json($state);
    }

    public function destroy(State $state) {
        $state->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
