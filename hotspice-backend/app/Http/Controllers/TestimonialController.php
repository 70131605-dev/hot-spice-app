<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json($testimonials);
    }
}
