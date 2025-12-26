<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification_Payment;

class NotificationPaymentController extends Controller
{
    // Récupérer toutes les notifications d'un user
    public function index(Request $request)
    {
        $user = $request->user();

        return Notification_Payment::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

     // Marquer une notification comme lue
    public function markAsRead($id, Request $request)
    {
        $user = $request->user();

        $notif = Notification_Payment::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $notif->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    // Supression d'une notif
    public function destroy($id, Request $request)
    {
    $user = $request->user();

    $notif = Notification_Payment::where('id', $id)
        ->where('user_id', $user->id)
        ->firstOrFail();

    $notif->delete();

    return response()->json(['deleted' => true]);
    }


    // Suppression de toutes les notifs
    public function destroyAll(Request $request)
    {
    $user = $request->user();

    Notification_Payment::where('user_id', $user->id)->delete();

    return response()->json(['deleted' => true]);
    }

    // Supprimer notifs lu
    public function destroyRead(Request $request)
    {
    $user = $request->user();

    Notification_Payment::where('user_id', $user->id)
        ->where('is_read', true)
        ->delete();

    return response()->json(['deleted' => true]);
    }





}
