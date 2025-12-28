<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FraisType extends Model
{
    protected $table = 'frais_type';
    protected $fillable = ['nom', 'montant_total', 'description'];

    public function tranches()
    {
        return $this->hasMany(TranchePaiement::class, 'frais_type_id');
    }
}
