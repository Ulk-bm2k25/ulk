<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});




/* Vous pouvez decommenter cette ligne pour tester les notifs
Vous vous rendez sur l'url /test-notif et cette notif sera généré et enregister dans la bdd ainsi les tests peuvent passer 
Route::get('/test-notif', function () {
    $user = \App\Models\User::first();

    $n = notify($user->id, "Test notif", "Ça fonctionne encore🎉");

    return response()->json([
        'id' => $n->id,
        'user_id'=>$n->user_id,
        'title' => $n->title,
        'type'=> $n->type,
        'content' => $n->content,
        'is_read' => $n->is_read
    ]);
});
*/