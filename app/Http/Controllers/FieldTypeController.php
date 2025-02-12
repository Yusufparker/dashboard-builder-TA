<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FieldType;
use Illuminate\Http\Request;

class FieldTypeController extends Controller
{
    public function list(){
        $types = FieldType::get();
        return response()->json([
            'status' => 'success',
            'data' => $types
        ]);
    }
}
