<?php

namespace App\Http\Controllers;

use App\Models\Chef;

class ChefController extends Controller
{
    public function index()
    {
        $chefs = Chef::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json($chefs);
    }
}
