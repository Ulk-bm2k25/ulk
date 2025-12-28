<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all system settings.
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Store or update multiple system settings.
     */
    public function store(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            Setting::setValue($key, $value);
        }

        return response()->json(['message' => 'Paramètres enregistrés avec succès.']);
    }

    /**
     * Update a single setting.
     */
    public function update(Request $request, $key)
    {
        $request->validate([
            'value' => 'required',
        ]);

        Setting::setValue($key, $request->value);

        return response()->json(['message' => "Paramètre '$key' mis à jour."]);
    }
}
