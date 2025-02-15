<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\EntityController;
use App\Http\Controllers\Dashboard\EntitySettingController;
use App\Http\Controllers\Dashboard\WidgetController;
use App\Http\Controllers\FieldTypeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Project\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->middleware('auth')->name('home');

Route::prefix('/project')->middleware('auth')->group(function () {
    Route::post('/store ', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/list', [ProjectController::class, 'list'])->name('project.list');
});

Route::get('/field-types/list', [FieldTypeController::class, 'list'])->middleware('auth');

Route::prefix('/p')->middleware(['auth', 'load.current_project', 'own.project'])->group(function () {
    Route::get('/', function(){
        return redirect()->route('home');
    })->name('dashboard.p');
    Route::get('/{uuid}', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::prefix('/{uuid}/customize')->group(function(){
        Route::get('/', [DashboardController::class, 'customize']);
        Route::post('/store', [WidgetController::class, 'store']);
    });
    Route::prefix('{uuid}/entities')->group(function(){
        Route::get('/', [EntityController::class, 'index']);
        Route::get('/new', [EntityController::class, 'create']);
        Route::post('/store', [EntityController::class, 'store']);
        Route::prefix('setting/{entity_uuid}')->group(function(){
            Route::get('/', [EntitySettingController::class, 'index']);
        });
    });
    Route::prefix('{uuid}/table/{entity_uuid}')->group(function(){
        Route::get('/', [EntityController::class, 'entityTable']);
        Route::get('new', [EntityController::class, 'addNewValue']);
    });


});

Route::prefix('api')->group(function(){
    Route::get('{endpoint}', [EntityController::class, 'getEntityValueAPI']);
});
Route::post('/store-value', [EntityController::class, 'storeValue'])->middleware('auth');


Route::prefix('/list')->middleware('auth')->group(function(){
    Route::get('get-entity-by-id/{id}', [EntityController::class, 'getEntityById']);
});




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
