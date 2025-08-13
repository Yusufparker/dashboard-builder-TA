<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\EntityController;
use App\Http\Controllers\Dashboard\EntitySettingController;
use App\Http\Controllers\Dashboard\ProjectUserController;
use App\Http\Controllers\Dashboard\WidgetController;
use App\Http\Controllers\FieldTypeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Project\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->middleware(['auth', 'verified'])->name('home');

Route::prefix('/project')->middleware(['auth', 'verified'])->group(function () {
    Route::post('/store', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/list', [ProjectController::class, 'list'])->name('project.list');
    Route::put('/{uuid}', [ProjectController::class, 'update'])->middleware(['own.project'])->name('project.update');
    Route::delete('/{uuid}', [ProjectController::class, 'delete'])->middleware(['own.project'])->name('project.delete');
});

Route::get('/field-types/list', [FieldTypeController::class, 'list'])->middleware('auth');

Route::prefix('/p')->middleware(['auth','verified','load.current_project', 'members'])->group(function () {
    Route::get('/', function(){
        return redirect()->route('home');
    })->name('dashboard.p');
    Route::get('/{uuid}', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::prefix('/{uuid}/customize')->middleware('own.project')->group(function(){
        Route::get('/', [DashboardController::class, 'customize']);
        Route::post('/store', [WidgetController::class, 'store']);
    });
    Route::prefix('{uuid}/entities')->middleware('own.project')->group(function(){
        Route::get('/', [EntityController::class, 'index']);
        Route::get('/new', [EntityController::class, 'create']);
        Route::post('/store', [EntityController::class, 'store']);
        Route::delete('/{entity_uuid}', [EntityController::class, 'destroy']);
        Route::prefix('setting')->group(function(){
            Route::get('{entity_uuid}', [EntitySettingController::class, 'index']);
            Route::post('store/{setting_id}', [EntitySettingController::class, 'store']);
        });
    });
    Route::prefix('{uuid}/table/{entity_uuid}')->group(function(){
        Route::get('/', [EntityController::class, 'entityTable']);
        Route::get('new', [EntityController::class, 'addNewValue']);
        Route::get('edit/{id}', [EntityController::class, 'editValue']);
    });

    Route::prefix('{uuid}/users')->middleware('own.project')->group(function(){
        Route::get('/',[ProjectUserController::class, 'index']);
        Route::post('invite', [ProjectUserController::class, 'invite']);
        Route::delete('{email}', [ProjectUserController::class, 'delete']);
    });


});

Route::get('/projects/{uuid}/accept-invite', [ProjectUserController::class, 'acceptInvite'])->middleware(['auth']);

Route::prefix('api')->group(function(){
    Route::get('{endpoint}', [EntityController::class, 'getEntityValueAPI']);
});
Route::post('/store-value', [EntityController::class, 'storeValue'])->middleware(['auth', 'verified']);
Route::post('/update-value/{id}', [EntityController::class, 'updateValue'])->middleware(['auth', 'verified']);
Route::delete('/delete-value/{id}', [EntityController::class, 'deleteValue'])->middleware(['auth', 'verified']);

Route::prefix('/list')->middleware(['auth','verified'])->group(function(){
    Route::get('get-entity-by-id/{id}', [EntityController::class, 'getEntityById']);
});




Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
